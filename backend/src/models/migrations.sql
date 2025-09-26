-- Enable extensions if needed (run manually in Supabase SQL editor)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types & tables (same as earlier project spec)
CREATE TYPE user_role AS ENUM ('admin', 'head', 'member', 'alumni');

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  year smallint,
  branch text,
  batch text,
  role user_role DEFAULT 'member',
  project_current text,
  project_ideas text,
  invited_by uuid,
  join_code text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  role user_role DEFAULT 'member',
  created_by uuid,
  expires_at timestamptz,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  head_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid,
  user_id uuid,
  role_in_team text,
  joined_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  team_id uuid,
  created_by uuid,
  status text DEFAULT 'ongoing',
  created_at timestamptz DEFAULT now()
);

CREATE TYPE meeting_type AS ENUM ('offline', 'online');

CREATE TABLE IF NOT EXISTS meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  meeting_type meeting_type NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  venue text,
  link text,
  agenda text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meeting_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid,
  user_id uuid,
  required boolean DEFAULT true,
  status text DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid,
  from_user uuid,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text,
  payload jsonb,
  sent_to uuid,
  via text,
  status text DEFAULT 'queued',
  created_at timestamptz DEFAULT now()
);
