-- Two tables referenced by the app's code (lib/database-supabase.ts,
-- lib/question-history.ts) that don't exist in the live DB yet. Both degrade
-- gracefully if missing (writes are wrapped in safeDbOperation / best-effort
-- try/catch), so nothing breaks without them — but per-subject score rollups
-- and cross-device no-repeat tracking won't persist until these are created.
-- Run this in the Supabase SQL editor.

-- Per-subject score rollup (Math, Telugu, Kannada, ...), one row per user per subject.
CREATE TABLE IF NOT EXISTS mywayapps_user_subject_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES mywayapps_user(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  total_score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  best_percentage NUMERIC DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_mywayapps_user_subject_progress_user_id
  ON mywayapps_user_subject_progress(user_id);

-- Sitewide "don't repeat questions" tracking, mirrored from localStorage.
-- One row per (user, game, question) the user has seen. The app's actual
-- source of truth is localStorage — this table is a best-effort mirror
-- (fire-and-forget insert) so history can eventually sync across devices.
CREATE TABLE IF NOT EXISTS mywayapps_user_question_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES mywayapps_user(id) ON DELETE CASCADE,
  game_key VARCHAR(255) NOT NULL,
  question_signature VARCHAR(255) NOT NULL,
  seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mywayapps_user_question_history_user_game
  ON mywayapps_user_question_history(user_id, game_key);

-- The 4 new Math Operations cards need matching rows here too, or their
-- getApplicationByName() lookup returns null and scores for a signed-in,
-- Supabase-connected user won't persist server-side (localStorage still
-- works regardless — this only affects the Supabase-backed path).
-- Uses WHERE NOT EXISTS rather than ON CONFLICT (name) since this table
-- has no confirmed unique constraint on "name".
INSERT INTO "mywayapps-applications" (name, category, subcategory, description, icon_emoji, color_scheme, route)
SELECT * FROM (VALUES
  ('Addition', 'Education', 'Math', '1, 2 & 3-digit addition — numbers and word problems', '➕', 'from-green-300 to-teal-500', '/math-addition'),
  ('Subtraction', 'Education', 'Math', '1, 2 & 3-digit subtraction — numbers and word problems', '➖', 'from-orange-300 to-rose-500', '/math-subtraction'),
  ('Multiplication', 'Education', 'Math', '1, 2 & 3-digit multiplication — numbers and word problems', '✖️', 'from-violet-300 to-fuchsia-500', '/math-multiplication'),
  ('Division', 'Education', 'Math', '1, 2 & 3-digit division — numbers and word problems', '➗', 'from-sky-300 to-cyan-500', '/math-division')
) AS new_apps(name, category, subcategory, description, icon_emoji, color_scheme, route)
WHERE NOT EXISTS (
  SELECT 1 FROM "mywayapps-applications" existing WHERE existing.name = new_apps.name
);
