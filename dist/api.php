<?php
// api.php
// Backend ultra-simples (Flat-file) para o ProjTrack

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite conexões locais para dev
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Last-Modified');
header('Access-Control-Expose-Headers: X-Last-Modified');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_file = __DIR__ . '/database.json';

// Trata requisições GET (Carregar Dados)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ativa compressão GZIP se suportada pelo cliente
    if (isset($_SERVER['HTTP_ACCEPT_ENCODING']) && strpos($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') !== false) {
        ob_start("ob_gzhandler");
    }

    if (file_exists($db_file)) {
        header('X-Last-Modified: ' . filemtime($db_file));
        echo file_get_contents($db_file);
    } else {
        header('X-Last-Modified: 0');
        // Retorna um array vazio se o banco não existir ainda
        echo json_encode([]);
    }

    // Fecha o buffer e envia para o cliente compactado
    if (ob_get_level() > 0) {
        ob_end_flush();
    }
    exit;
}

// Trata requisições POST (Salvar Dados)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = file_get_contents('php://input');
    
    // Valida se é um JSON válido
    if (json_decode($json_input) !== null) {
        
        $client_mtime = isset($_SERVER['HTTP_X_LAST_MODIFIED']) ? (int)$_SERVER['HTTP_X_LAST_MODIFIED'] : 0;
        
        if (file_exists($db_file)) {
            $server_mtime = filemtime($db_file);
            // Dá 1 segundo de tolerância
            if ($client_mtime > 0 && $client_mtime < ($server_mtime - 1)) {
                http_response_code(409);
                echo json_encode(["status" => "error", "message" => "Conflito: Arquivo modificado por outro usuário"]);
                exit;
            }
        }

        $result = file_put_contents($db_file, $json_input, LOCK_EX);
        
        if ($result !== false) {
            http_response_code(200);
            header('X-Last-Modified: ' . filemtime($db_file));
            echo json_encode(["status" => "success", "message" => "Dados salvos com sucesso"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Erro ao escrever no arquivo database.json. Verifique as permissões (chmod 666 ou 755)."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "O payload recebido não é um JSON válido"]);
    }
    exit;
}

http_response_code(405);
echo json_encode(["status" => "error", "message" => "Método não permitido"]);
?>
