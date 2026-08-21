<?php
// migrate.php
// Script de uso único: lê database.json (neste mesmo diretório) e popula
// database.sqlite. NÃO apaga nem modifica o database.json original — ele
// continua sendo o fallback histórico caso algo precise ser revertido.
//
// Uso local:    php public/migrate.php
// Uso em prod:  php migrate.php   (rodando de dentro da raiz do site na VPS)
//
// Só pode ser executado via linha de comando: mesmo estando dentro de
// public/ (e portanto acessível pela mesma URL de api.php), uma tentativa
// de acessá-lo via navegador/HTTP é recusada abaixo.
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Este script só pode ser executado via linha de comando (CLI).']);
    exit(1);
}

require_once __DIR__ . '/db_lib.php';

$json_path = __DIR__ . '/database.json';
$sqlite_path = __DIR__ . '/database.sqlite';
$schema_path = __DIR__ . '/schema.sql';

if (!file_exists($json_path)) {
    fwrite(STDERR, "Erro: $json_path não encontrado.\n");
    exit(1);
}

$json_content = file_get_contents($json_path);
$projects = json_decode($json_content, true);

if ($projects === null || !is_array($projects)) {
    fwrite(STDERR, "Erro: $json_path não contém um JSON válido.\n");
    exit(1);
}

echo "Lidos " . count($projects) . " projeto(s) de database.json\n";

$pdo = db_connect($sqlite_path);
db_init_schema($pdo, $schema_path);

try {
    $pdo->beginTransaction();
    db_replace_all_projects($pdo, $projects);
    db_set_last_modified($pdo, time());
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    fwrite(STDERR, "Erro na migração, nada foi escrito: " . $e->getMessage() . "\n");
    exit(1);
}

echo "Migração concluída em $sqlite_path\n\n";
echo "Contagem de linhas por tabela:\n";
foreach ([
    'projects', 'canvas_items', 'deliveries', 'tasks',
    'timesheet_entries', 'project_files', 'discussion_messages', 'team_members',
] as $table) {
    $count = $pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
    printf("  %-20s %d\n", $table, $count);
}

echo "\nVerificação: comparando GET reconstituído com o JSON original...\n";
$roundtrip = db_load_projects($pdo);
$originalCount = count($projects);
$roundtripCount = count($roundtrip);
if ($originalCount === $roundtripCount) {
    echo "  OK: $roundtripCount projeto(s) em ambos.\n";
} else {
    echo "  ATENÇÃO: original tinha $originalCount, SQLite reconstituiu $roundtripCount.\n";
}

foreach ($projects as $i => $orig) {
    $rebuilt = $roundtrip[$i] ?? null;
    if ($rebuilt === null) {
        echo "  ATENÇÃO: projeto '{$orig['id']}' não encontrado após migração.\n";
        continue;
    }
    $origTasks = count($orig['tasks'] ?? []);
    $rebuiltTasks = count($rebuilt['tasks'] ?? []);
    if ($origTasks !== $rebuiltTasks) {
        echo "  ATENÇÃO: projeto '{$orig['id']}' tinha $origTasks tasks, agora tem $rebuiltTasks.\n";
    }
    echo "  Projeto '{$orig['id']}' ({$orig['name']}): OK\n";
}
