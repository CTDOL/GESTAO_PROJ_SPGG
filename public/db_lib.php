<?php
// db_lib.php
// Camada de acesso a dados compartilhada entre api.php (produção/dev) e o
// script de migração. Único lugar que sabe converter entre o array
// Project[] (formato que o frontend já espera) e as tabelas SQLite.

const CANVAS_CATEGORIES = [
    'proposito', 'objetivo', 'justificativa', 'produto', 'stakeholders',
    'resistentes', 'premissas', 'restricoes', 'riscos', 'escopo',
    'naoEscopo', 'beneficios',
];

function db_connect(string $sqlite_path): PDO
{
    $pdo = new PDO('sqlite:' . $sqlite_path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA foreign_keys = ON');
    return $pdo;
}

function db_init_schema(PDO $pdo, string $schema_path): void
{
    $pdo->exec(file_get_contents($schema_path));
}

function db_get_last_modified(PDO $pdo): int
{
    $stmt = $pdo->query('SELECT last_modified FROM sync_meta WHERE id = 1');
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ? (int)$row['last_modified'] : 0;
}

function db_set_last_modified(PDO $pdo, int $timestamp): void
{
    $stmt = $pdo->prepare('UPDATE sync_meta SET last_modified = :ts WHERE id = 1');
    $stmt->execute(['ts' => $timestamp]);
}

/**
 * Carrega todos os projetos do banco e remonta o shape Project[] exatamente
 * como o frontend espera (src/types/index.ts).
 */
function db_load_projects(PDO $pdo): array
{
    $projects = [];
    $projectRows = $pdo->query('SELECT * FROM projects')->fetchAll(PDO::FETCH_ASSOC);

    foreach ($projectRows as $p) {
        $projectId = $p['id'];

        // canvasData: 12 categorias de CanvasItem + planoAcao (deliveries)
        $canvasData = [
            'nomeProjeto' => $p['nome_projeto'],
            'codigoProjeto' => $p['codigo_projeto'],
        ];
        foreach (CANVAS_CATEGORIES as $category) {
            $canvasData[$category] = [];
        }

        $itemsStmt = $pdo->prepare('SELECT * FROM canvas_items WHERE project_id = :pid ORDER BY category, sort_order');
        $itemsStmt->execute(['pid' => $projectId]);
        foreach ($itemsStmt->fetchAll(PDO::FETCH_ASSOC) as $item) {
            $entry = ['id' => $item['id'], 'title' => $item['title'], 'description' => $item['description']];
            if ($item['tag'] !== null && $item['tag'] !== '') {
                $entry['tag'] = $item['tag'];
            }
            $canvasData[$item['category']][] = $entry;
        }

        $deliveriesStmt = $pdo->prepare('SELECT * FROM deliveries WHERE project_id = :pid ORDER BY sort_order');
        $deliveriesStmt->execute(['pid' => $projectId]);
        $planoAcao = [];
        foreach ($deliveriesStmt->fetchAll(PDO::FETCH_ASSOC) as $d) {
            $planoAcao[] = [
                'id' => $d['id'],
                'order' => (int)$d['sort_order'],
                'name' => $d['name'],
                'month' => $d['month'],
                'monthNumber' => (int)$d['month_number'],
                'investment' => (float)$d['investment'],
                'completed' => (bool)$d['completed'],
                'progress' => (int)$d['progress'],
                'status' => $d['status'],
            ];
        }
        $canvasData['planoAcao'] = $planoAcao;

        // tasks
        $tasksStmt = $pdo->prepare('SELECT * FROM tasks WHERE project_id = :pid');
        $tasksStmt->execute(['pid' => $projectId]);
        $tasks = [];
        foreach ($tasksStmt->fetchAll(PDO::FETCH_ASSOC) as $t) {
            $task = [
                'id' => $t['id'],
                'title' => $t['title'],
                'description' => $t['description'],
                'status' => $t['status'],
                'priority' => $t['priority'],
                'assignee' => $t['assignee'],
                'assigneeRole' => $t['assignee_role'],
                'deliveryId' => $t['delivery_id'],
                'dueDate' => $t['due_date'],
                'hoursSpent' => (float)$t['hours_spent'],
                'estimatedHours' => (float)$t['estimated_hours'],
            ];
            if ($t['lgpd_tag'] !== null) {
                $task['lgpdTag'] = (bool)$t['lgpd_tag'];
            }
            $tasks[] = $task;
        }

        // timesheet
        $tsStmt = $pdo->prepare('SELECT * FROM timesheet_entries WHERE project_id = :pid');
        $tsStmt->execute(['pid' => $projectId]);
        $timesheet = [];
        foreach ($tsStmt->fetchAll(PDO::FETCH_ASSOC) as $ts) {
            $timesheet[] = [
                'id' => $ts['id'],
                'date' => $ts['date'],
                'member' => $ts['member'],
                'role' => $ts['role'],
                'deliveryId' => $ts['delivery_id'],
                'deliveryName' => $ts['delivery_name'],
                'hours' => (float)$ts['hours'],
                'description' => $ts['description'],
            ];
        }

        // files
        $filesStmt = $pdo->prepare('SELECT * FROM project_files WHERE project_id = :pid');
        $filesStmt->execute(['pid' => $projectId]);
        $files = [];
        foreach ($filesStmt->fetchAll(PDO::FETCH_ASSOC) as $f) {
            $files[] = [
                'id' => $f['id'],
                'name' => $f['name'],
                'category' => $f['category'],
                'size' => $f['size'],
                'uploadedAt' => $f['uploaded_at'],
                'uploadedBy' => $f['uploaded_by'],
            ];
        }

        // discussions
        $discStmt = $pdo->prepare('SELECT * FROM discussion_messages WHERE project_id = :pid');
        $discStmt->execute(['pid' => $projectId]);
        $discussions = [];
        foreach ($discStmt->fetchAll(PDO::FETCH_ASSOC) as $d) {
            $discussions[] = [
                'id' => $d['id'],
                'author' => $d['author'],
                'role' => $d['role'],
                'text' => $d['text'],
                'timestamp' => $d['timestamp'],
                'avatarColor' => $d['avatar_color'],
            ];
        }

        // team members
        $tmStmt = $pdo->prepare('SELECT * FROM team_members WHERE project_id = :pid');
        $tmStmt->execute(['pid' => $projectId]);
        $teamMembers = [];
        foreach ($tmStmt->fetchAll(PDO::FETCH_ASSOC) as $tm) {
            $teamMembers[] = [
                'id' => $tm['id'],
                'name' => $tm['name'],
                'role' => $tm['role'],
                'isActive' => $tm['is_active'] !== null ? (bool)$tm['is_active'] : null,
            ];
        }

        $project = [
            'id' => $p['id'],
            'code' => $p['code'],
            'name' => $p['name'],
            'description' => $p['description'],
            'budget' => (float)$p['budget'],
            'durationMonths' => (int)$p['duration_months'],
            'canvasData' => $canvasData,
            'tasks' => $tasks,
            'timesheet' => $timesheet,
            'files' => $files,
            'discussions' => $discussions,
        ];
        if (!empty($teamMembers)) {
            $project['teamMembers'] = $teamMembers;
        }
        if ($p['status'] !== null && $p['status'] !== '') {
            $project['status'] = $p['status'];
        }

        $projects[] = $project;
    }

    return $projects;
}

/**
 * Substitui o conteúdo de todas as tabelas por completo a partir do array
 * Project[] recebido. Deve ser chamada dentro de uma transação pelo caller.
 */
function db_replace_all_projects(PDO $pdo, array $projects): void
{
    // Ordem inversa das FKs para não violar constraints
    foreach ([
        'canvas_items', 'tasks', 'timesheet_entries', 'project_files',
        'discussion_messages', 'team_members', 'deliveries', 'projects',
    ] as $table) {
        $pdo->exec("DELETE FROM $table");
    }

    $insertProject = $pdo->prepare(
        'INSERT INTO projects (id, code, name, description, budget, duration_months, status, nome_projeto, codigo_projeto)
         VALUES (:id, :code, :name, :description, :budget, :duration_months, :status, :nome_projeto, :codigo_projeto)'
    );
    $insertCanvasItem = $pdo->prepare(
        'INSERT INTO canvas_items (id, project_id, category, sort_order, title, description, tag)
         VALUES (:id, :project_id, :category, :sort_order, :title, :description, :tag)'
    );
    $insertDelivery = $pdo->prepare(
        'INSERT INTO deliveries (id, project_id, sort_order, name, month, month_number, investment, completed, progress, status)
         VALUES (:id, :project_id, :sort_order, :name, :month, :month_number, :investment, :completed, :progress, :status)'
    );
    $insertTask = $pdo->prepare(
        'INSERT INTO tasks (id, project_id, title, description, status, priority, assignee, assignee_role, delivery_id, lgpd_tag, due_date, hours_spent, estimated_hours)
         VALUES (:id, :project_id, :title, :description, :status, :priority, :assignee, :assignee_role, :delivery_id, :lgpd_tag, :due_date, :hours_spent, :estimated_hours)'
    );
    $insertTimesheet = $pdo->prepare(
        'INSERT INTO timesheet_entries (id, project_id, date, member, role, delivery_id, delivery_name, hours, description)
         VALUES (:id, :project_id, :date, :member, :role, :delivery_id, :delivery_name, :hours, :description)'
    );
    $insertFile = $pdo->prepare(
        'INSERT INTO project_files (id, project_id, name, category, size, uploaded_at, uploaded_by)
         VALUES (:id, :project_id, :name, :category, :size, :uploaded_at, :uploaded_by)'
    );
    $insertDiscussion = $pdo->prepare(
        'INSERT INTO discussion_messages (id, project_id, author, role, text, timestamp, avatar_color)
         VALUES (:id, :project_id, :author, :role, :text, :timestamp, :avatar_color)'
    );
    $insertTeamMember = $pdo->prepare(
        'INSERT INTO team_members (id, project_id, name, role, is_active)
         VALUES (:id, :project_id, :name, :role, :is_active)'
    );

    foreach ($projects as $proj) {
        $projectId = $proj['id'];
        $canvasData = $proj['canvasData'] ?? [];

        $insertProject->execute([
            'id' => $projectId,
            'code' => $proj['code'] ?? '',
            'name' => $proj['name'] ?? '',
            'description' => $proj['description'] ?? '',
            'budget' => $proj['budget'] ?? 0,
            'duration_months' => $proj['durationMonths'] ?? 0,
            'status' => $proj['status'] ?? null,
            'nome_projeto' => $canvasData['nomeProjeto'] ?? null,
            'codigo_projeto' => $canvasData['codigoProjeto'] ?? null,
        ]);

        foreach (CANVAS_CATEGORIES as $category) {
            $items = $canvasData[$category] ?? [];
            foreach ($items as $order => $item) {
                $insertCanvasItem->execute([
                    'id' => $item['id'],
                    'project_id' => $projectId,
                    'category' => $category,
                    'sort_order' => $order,
                    'title' => $item['title'] ?? '',
                    'description' => $item['description'] ?? '',
                    'tag' => $item['tag'] ?? null,
                ]);
            }
        }

        $planoAcao = $canvasData['planoAcao'] ?? [];
        foreach ($planoAcao as $order => $d) {
            $insertDelivery->execute([
                'id' => $d['id'],
                'project_id' => $projectId,
                'sort_order' => $d['order'] ?? $order,
                'name' => $d['name'] ?? '',
                'month' => $d['month'] ?? '',
                'month_number' => $d['monthNumber'] ?? 0,
                'investment' => $d['investment'] ?? 0,
                'completed' => !empty($d['completed']) ? 1 : 0,
                'progress' => $d['progress'] ?? 0,
                'status' => $d['status'] ?? '',
            ]);
        }

        foreach (($proj['tasks'] ?? []) as $t) {
            $insertTask->execute([
                'id' => $t['id'],
                'project_id' => $projectId,
                'title' => $t['title'] ?? '',
                'description' => $t['description'] ?? '',
                'status' => $t['status'] ?? '',
                'priority' => $t['priority'] ?? '',
                'assignee' => $t['assignee'] ?? '',
                'assignee_role' => $t['assigneeRole'] ?? '',
                'delivery_id' => $t['deliveryId'] ?? null,
                'lgpd_tag' => isset($t['lgpdTag']) ? ($t['lgpdTag'] ? 1 : 0) : null,
                'due_date' => $t['dueDate'] ?? '',
                'hours_spent' => $t['hoursSpent'] ?? 0,
                'estimated_hours' => $t['estimatedHours'] ?? 0,
            ]);
        }

        foreach (($proj['timesheet'] ?? []) as $ts) {
            $insertTimesheet->execute([
                'id' => $ts['id'],
                'project_id' => $projectId,
                'date' => $ts['date'] ?? '',
                'member' => $ts['member'] ?? '',
                'role' => $ts['role'] ?? '',
                'delivery_id' => $ts['deliveryId'] ?? null,
                'delivery_name' => $ts['deliveryName'] ?? '',
                'hours' => $ts['hours'] ?? 0,
                'description' => $ts['description'] ?? '',
            ]);
        }

        foreach (($proj['files'] ?? []) as $f) {
            $insertFile->execute([
                'id' => $f['id'],
                'project_id' => $projectId,
                'name' => $f['name'] ?? '',
                'category' => $f['category'] ?? '',
                'size' => $f['size'] ?? '',
                'uploaded_at' => $f['uploadedAt'] ?? '',
                'uploaded_by' => $f['uploadedBy'] ?? '',
            ]);
        }

        foreach (($proj['discussions'] ?? []) as $d) {
            $insertDiscussion->execute([
                'id' => $d['id'],
                'project_id' => $projectId,
                'author' => $d['author'] ?? '',
                'role' => $d['role'] ?? '',
                'text' => $d['text'] ?? '',
                'timestamp' => $d['timestamp'] ?? '',
                'avatar_color' => $d['avatarColor'] ?? '',
            ]);
        }

        foreach (($proj['teamMembers'] ?? []) as $tm) {
            $insertTeamMember->execute([
                'id' => $tm['id'],
                'project_id' => $projectId,
                'name' => $tm['name'] ?? '',
                'role' => $tm['role'] ?? '',
                'is_active' => isset($tm['isActive']) ? ($tm['isActive'] ? 1 : 0) : null,
            ]);
        }
    }
}
