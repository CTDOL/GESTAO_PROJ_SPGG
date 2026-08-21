<?php
// api.php
// Backend do ProjTrack, persistindo em SQLite (public/database.sqlite).
// Mantém o mesmo contrato HTTP do backend anterior (flat-file):
// GET retorna Project[] com header X-Last-Modified; POST recebe Project[]
// completo, valida X-Last-Modified contra o servidor (409 em conflito) e
// substitui os dados dentro de uma transação.

require_once __DIR__ . '/db_lib.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite conexões locais para dev
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Last-Modified');
header('Access-Control-Expose-Headers: X-Last-Modified');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$sqlite_path = __DIR__ . '/database.sqlite';
$schema_path = __DIR__ . '/schema.sql';

if (!file_exists($sqlite_path)) {
    // Primeira execução no ambiente: cria o banco vazio a partir do schema.
    $pdo = db_connect($sqlite_path);
    db_init_schema($pdo, $schema_path);
} else {
    $pdo = db_connect($sqlite_path);
}

// Trata requisições GET (Carregar Dados)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SERVER['HTTP_ACCEPT_ENCODING']) && strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false) {
        ob_start('ob_gzhandler');
    }

    $projects = db_load_projects($pdo);
    header('X-Last-Modified: ' . db_get_last_modified($pdo));
    echo json_encode($projects);

    if (ob_get_level() > 0) {
        ob_end_flush();
    }
    exit;
}

// Trata requisições POST (Salvar Dados)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = file_get_contents('php://input');
    $projects = json_decode($json_input, true);

    if ($projects !== null && is_array($projects)) {
        $client_mtime = isset($_SERVER['HTTP_X_LAST_MODIFIED']) ? (int)$_SERVER['HTTP_X_LAST_MODIFIED'] : 0;
        $server_mtime = db_get_last_modified($pdo);

        // Mesma tolerância de 1 segundo do modelo anterior
        if ($client_mtime > 0 && $server_mtime > 0 && $client_mtime < ($server_mtime - 1)) {
            http_response_code(409);
            echo json_encode(['status' => 'error', 'message' => 'Conflito: Dados modificados por outro usuário']);
            exit;
        }

        try {
            $pdo->beginTransaction();
            db_replace_all_projects($pdo, $projects);
            $new_mtime = time();
            db_set_last_modified($pdo, $new_mtime);
            $pdo->commit();

            http_response_code(200);
            header('X-Last-Modified: ' . $new_mtime);
            echo json_encode(['status' => 'success', 'message' => 'Dados salvos com sucesso']);
        } catch (Exception $e) {
            $pdo->rollBack();
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar no banco de dados: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'O payload recebido não é um JSON válido']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
