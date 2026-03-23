CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ BEGIN
  CREATE TYPE doctrine_type AS ENUM ('warborn','stone_oath','ember_rite','veil_path','harvest_covenant');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE building_type AS ENUM ('keep','lumberyard','iron_mine','granary','ember_kiln','storehouse','barracks','range','watchtower');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE troop_type AS ENUM ('reaver','pikeguard','ashbowman','ravensworn');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE map_location_type AS ENUM ('player_bastion','ruin','beast_lair');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE march_action_type AS ENUM ('scout','raid','attack','return');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE march_status_type AS ENUM ('travelling','resolving','returning','completed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE report_type AS ENUM ('scout','raid','attack','incoming');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  doctrine doctrine_type,
  title TEXT NOT NULL DEFAULT 'Warden of the Bastion',
  power_score INTEGER NOT NULL DEFAULT 0,
  raid_score INTEGER NOT NULL DEFAULT 0,
  growth_score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bastions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_resource_tick_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  timber INTEGER NOT NULL DEFAULT 0,
  iron INTEGER NOT NULL DEFAULT 0,
  grain INTEGER NOT NULL DEFAULT 0,
  ember INTEGER NOT NULL DEFAULT 0,
  timber_per_hour INTEGER NOT NULL DEFAULT 0,
  iron_per_hour INTEGER NOT NULL DEFAULT 0,
  grain_per_hour INTEGER NOT NULL DEFAULT 0,
  ember_per_hour INTEGER NOT NULL DEFAULT 0,
  storage_capacity INTEGER NOT NULL DEFAULT 1500,
  population_used INTEGER NOT NULL DEFAULT 0,
  population_capacity INTEGER NOT NULL DEFAULT 0,
  UNIQUE (x,y)
);
CREATE TABLE IF NOT EXISTS bastion_buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bastion_id UUID NOT NULL REFERENCES bastions(id) ON DELETE CASCADE,
  building_type building_type NOT NULL,
  level INTEGER NOT NULL DEFAULT 0,
  upgrade_started_at TIMESTAMPTZ,
  upgrade_ends_at TIMESTAMPTZ,
  UNIQUE (bastion_id, building_type)
);
CREATE TABLE IF NOT EXISTS troop_stacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bastion_id UUID NOT NULL REFERENCES bastions(id) ON DELETE CASCADE,
  troop_type troop_type NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  UNIQUE (bastion_id, troop_type)
);
CREATE TABLE IF NOT EXISTS troop_training_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bastion_id UUID NOT NULL REFERENCES bastions(id) ON DELETE CASCADE,
  troop_type troop_type NOT NULL,
  quantity_total INTEGER NOT NULL,
  quantity_completed INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued'
);
CREATE TABLE IF NOT EXISTS map_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_type map_location_type NOT NULL,
  owner_bastion_id UUID REFERENCES bastions(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  difficulty_label TEXT,
  notes TEXT,
  UNIQUE (x,y)
);
CREATE TABLE IF NOT EXISTS neutral_forces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES map_locations(id) ON DELETE CASCADE,
  troop_type troop_type NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  UNIQUE (location_id, troop_type)
);
CREATE TABLE IF NOT EXISTS marches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_bastion_id UUID NOT NULL REFERENCES bastions(id) ON DELETE CASCADE,
  target_location_id UUID NOT NULL REFERENCES map_locations(id) ON DELETE CASCADE,
  march_type march_action_type NOT NULL,
  status march_status_type NOT NULL DEFAULT 'travelling',
  departs_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  arrives_at TIMESTAMPTZ NOT NULL,
  returns_at TIMESTAMPTZ,
  distance INTEGER NOT NULL,
  doctrine_snapshot doctrine_type,
  report_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS march_troops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  march_id UUID NOT NULL REFERENCES marches(id) ON DELETE CASCADE,
  troop_type troop_type NOT NULL,
  quantity_sent INTEGER NOT NULL,
  quantity_survived INTEGER,
  UNIQUE (march_id, troop_type)
);
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_type report_type NOT NULL,
  related_march_id UUID REFERENCES marches(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);
