-- ENABLE UUID extension --
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TABLE: projects --
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  craft_type VARCHAR(20) NOT NULL DEFAULT 'knit', -- 'knit' | 'crochet'
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active' | 'paused' | 'completed' | 'archived'
  pattern_name VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()), 
  deleted_at TIMESTAMPTZ
);

-- TABLE: project_parts --
CREATE TABLE project_parts (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  current_rows INTEGER NOT NULL DEFAULT 0,
  total_rows INTEGER DEFAULT NULL,
  needle_size VARCHAR(40),
  yarn_details VARCHAR(120),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()), 
  deleted_at TIMESTAMPTZ
);

-- TABLE: secondary_counters --
CREATE TABLE secondary_counters (
  id UUID PRIMARY KEY,
  part_id UUID NOT NULL REFERENCES project_parts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  starts_on_global_row INTEGER NOT NULL DEFAULT 1,
  rows_per_repeat INTEGER NOT NULL DEFAULT 1,
  total_repeats INTEGER NOT NULL DEFAULT 1,
  notes VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()), 
  deleted_at TIMESTAMPTZ
);

-- INDEXES --
CREATE INDEX idx_projects_sync ON projects (user_id, updated_at);
CREATE INDEX idx_parts_sync ON project_parts (user_id, updated_at);
CREATE INDEX idx_counters_sync ON secondary_counters (user_id, updated_at);

-- TRIGGERS --
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_project_parts_updated_at
  BEFORE UPDATE ON project_parts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_secondary_counters_updated_at
  BEFORE UPDATE ON secondary_counters
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ROW LEVEL SECURITY --
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE secondary_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own projects"
    ON projects FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can manage their own project parts"
    ON project_parts FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own counters"
    ON secondary_counters FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);