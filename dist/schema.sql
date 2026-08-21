DROP TABLE IF EXISTS canvas_items;
DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS timesheet_entries;
DROP TABLE IF EXISTS project_files;
DROP TABLE IF EXISTS discussion_messages;
DROP TABLE IF EXISTS team_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS sync_meta;

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  budget REAL,
  duration_months INTEGER,
  status TEXT,
  nome_projeto TEXT,
  codigo_projeto TEXT
);

CREATE TABLE canvas_items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  tag TEXT
);
CREATE INDEX idx_canvas_items_project ON canvas_items(project_id);

CREATE TABLE deliveries (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sort_order INTEGER,
  name TEXT,
  month TEXT,
  month_number INTEGER,
  investment REAL,
  completed INTEGER,
  progress INTEGER,
  status TEXT
);
CREATE INDEX idx_deliveries_project ON deliveries(project_id);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT,
  description TEXT,
  status TEXT,
  priority TEXT,
  assignee TEXT,
  assignee_role TEXT,
  delivery_id TEXT REFERENCES deliveries(id),
  lgpd_tag INTEGER,
  due_date TEXT,
  hours_spent REAL,
  estimated_hours REAL
);
CREATE INDEX idx_tasks_project ON tasks(project_id);

CREATE TABLE timesheet_entries (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  date TEXT,
  member TEXT,
  role TEXT,
  delivery_id TEXT REFERENCES deliveries(id),
  delivery_name TEXT,
  hours REAL,
  description TEXT
);
CREATE INDEX idx_timesheet_project ON timesheet_entries(project_id);

CREATE TABLE project_files (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT,
  category TEXT,
  size TEXT,
  uploaded_at TEXT,
  uploaded_by TEXT
);
CREATE INDEX idx_files_project ON project_files(project_id);

CREATE TABLE discussion_messages (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  author TEXT,
  role TEXT,
  text TEXT,
  timestamp TEXT,
  avatar_color TEXT
);
CREATE INDEX idx_discussions_project ON discussion_messages(project_id);

CREATE TABLE team_members (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT,
  role TEXT,
  is_active INTEGER
);
CREATE INDEX idx_team_members_project ON team_members(project_id);

CREATE TABLE sync_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  last_modified INTEGER NOT NULL
);
INSERT INTO sync_meta (id, last_modified) VALUES (1, 0);
