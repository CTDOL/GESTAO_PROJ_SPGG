<?php
// api.php
// Backend ultra-simples (Flat-file) para o ProjTrack

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite conexões locais para dev
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$db_file = __DIR__ . '/database.json';

// Trata requisições GET (Carregar Dados)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($db_file)) {
        echo file_get_contents($db_file);
    } else {
        // Retorna um array vazio se o banco não existir ainda
        echo json_encode([]);
    }
    exit;
}

// Trata requisições POST (Salvar Dados)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_input = file_get_contents('php://input');
    
    // Valida se é um JSON válido
    if (json_decode($json_input) !== null) {
        $result = file_put_contents($db_file, $json_input);
        
        if ($result !== false) {
            http_response_code(200);
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
