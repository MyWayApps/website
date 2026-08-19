-- Fixes the root cause behind the 18 duplicate "Demo User" rows: mywayapps_user
-- already existed before scripts/06 ran, so scripts/06's "CREATE TABLE IF NOT
-- EXISTS ... UNIQUE" never actually applied a unique constraint to it. Without
-- one, every findOrCreateUser() race (e.g. React StrictMode's double-mount in
-- dev) that didn't see the other's insert yet just created a fresh row.
--
-- This generalizes beyond the demo account on purpose — the same race could in
-- principle duplicate any email, not just demo@mywayapps.com, so the cleanup
-- below dedupes every email group that has more than one row, not just that one.
--
-- For each duplicate email: keeps the EARLIEST-created row, reassigns all its
-- children (scores, progress, subject progress, question history) to that
-- kept row instead of dropping them, then deletes the extra user rows. Where a
-- duplicate's progress/subject-progress row would collide with the keeper's
-- existing one for the same app/subject (both have a row for the same
-- application_id or subject), the two are merged — best_score/best_percentage
-- take the max, attempts/time are summed, last_played_at takes the latest —
-- rather than silently dropped. (achievements/game_data JSONB fields are NOT
-- deep-merged in that collision case, the keeper's values win — a deliberate
-- simplification since this is cleaning up junk duplicate rows, not
-- reconciling meaningfully different play sessions.)
--
-- Wrapped in a transaction — if anything fails partway, nothing is changed.
-- Run this in the Supabase SQL editor.

BEGIN;

CREATE TEMP TABLE user_dedup_map AS
WITH ranked AS (
  SELECT id, email,
         ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at ASC, id ASC) AS rn
  FROM mywayapps_user
)
SELECT dup.id AS dup_id, keep.id AS keeper_id
FROM ranked dup
JOIN ranked keep ON keep.email = dup.email AND keep.rn = 1
WHERE dup.rn > 1;

-- Scores and question history have no per-user uniqueness constraint — safe
-- to reassign directly, no collision possible.
UPDATE mywayapps_user_scores s
SET user_id = m.keeper_id
FROM user_dedup_map m
WHERE s.user_id = m.dup_id;

UPDATE mywayapps_user_question_history h
SET user_id = m.keeper_id
FROM user_dedup_map m
WHERE h.user_id = m.dup_id;

-- Progress: UNIQUE(user_id, application_id) means a duplicate's row can
-- collide with the keeper's row for the same app. Merge those into the
-- keeper's row first, delete the now-merged duplicate rows, then reassign
-- whatever's left (no collision) directly.
UPDATE mywayapps_user_progress keep_row
SET best_score = GREATEST(keep_row.best_score, dup_row.best_score),
    total_attempts = keep_row.total_attempts + dup_row.total_attempts,
    total_time_spent = keep_row.total_time_spent + dup_row.total_time_spent,
    last_played_at = GREATEST(keep_row.last_played_at, dup_row.last_played_at)
FROM mywayapps_user_progress dup_row
JOIN user_dedup_map m ON m.dup_id = dup_row.user_id
WHERE keep_row.user_id = m.keeper_id
  AND keep_row.application_id = dup_row.application_id;

DELETE FROM mywayapps_user_progress dup_row
USING user_dedup_map m
WHERE dup_row.user_id = m.dup_id
  AND EXISTS (
    SELECT 1 FROM mywayapps_user_progress keep_row
    WHERE keep_row.user_id = m.keeper_id AND keep_row.application_id = dup_row.application_id
  );

UPDATE mywayapps_user_progress dup_row
SET user_id = m.keeper_id
FROM user_dedup_map m
WHERE dup_row.user_id = m.dup_id;

-- Same collision handling for subject progress: UNIQUE(user_id, subject).
UPDATE mywayapps_user_subject_progress keep_row
SET total_score = keep_row.total_score + dup_row.total_score,
    total_attempts = keep_row.total_attempts + dup_row.total_attempts,
    best_percentage = GREATEST(keep_row.best_percentage, dup_row.best_percentage),
    last_played_at = GREATEST(keep_row.last_played_at, dup_row.last_played_at)
FROM mywayapps_user_subject_progress dup_row
JOIN user_dedup_map m ON m.dup_id = dup_row.user_id
WHERE keep_row.user_id = m.keeper_id
  AND keep_row.subject = dup_row.subject;

DELETE FROM mywayapps_user_subject_progress dup_row
USING user_dedup_map m
WHERE dup_row.user_id = m.dup_id
  AND EXISTS (
    SELECT 1 FROM mywayapps_user_subject_progress keep_row
    WHERE keep_row.user_id = m.keeper_id AND keep_row.subject = dup_row.subject
  );

UPDATE mywayapps_user_subject_progress dup_row
SET user_id = m.keeper_id
FROM user_dedup_map m
WHERE dup_row.user_id = m.dup_id;

-- Everything that referenced a duplicate now points at its keeper — drop the
-- duplicate user rows themselves.
DELETE FROM mywayapps_user u
USING user_dedup_map m
WHERE u.id = m.dup_id;

DROP TABLE user_dedup_map;

-- Now safe: no duplicate emails remain.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mywayapps_user_email_unique'
  ) THEN
    ALTER TABLE mywayapps_user ADD CONSTRAINT mywayapps_user_email_unique UNIQUE (email);
  END IF;
END $$;

COMMIT;

-- Verification: should return zero rows (no email appears more than once).
SELECT email, COUNT(*) FROM mywayapps_user GROUP BY email HAVING COUNT(*) > 1;
