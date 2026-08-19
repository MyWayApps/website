-- Adds correctness tracking to the existing question-history table so fixed-pool
-- activities (e.g. Clock Reading) can compute real coverage — "has this user
-- ever answered each question in the pool correctly?" — not just "has this
-- question ever been shown?" Degrades gracefully if not run: lib/question-history.ts's
-- mirrorAnswerToSupabase() is wrapped in try/catch and localStorage stays the
-- local source of truth regardless.
--
-- Requires scripts/03-create-subject-progress-and-question-history.sql to have
-- been run first (creates mywayapps_user_question_history).
--
-- Run this in the Supabase SQL editor.

ALTER TABLE mywayapps_user_question_history
  ADD COLUMN IF NOT EXISTS is_correct BOOLEAN NOT NULL DEFAULT false;
