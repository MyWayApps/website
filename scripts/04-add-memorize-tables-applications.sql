-- Memorize Tables now saves a separate score per operation (Addition,
-- Subtraction, Multiplication, Division) instead of pooling everything into
-- one "Memorize Tables" total. Each needs its own row in "mywayapps-applications"
-- for getApplicationByName() to resolve when saving scores for a signed-in,
-- Supabase-connected user (localStorage-based scoring still works without
-- this — it only affects the Supabase-backed path). Run in the Supabase SQL editor.
INSERT INTO "mywayapps-applications" (name, category, subcategory, description, icon_emoji, color_scheme, route)
SELECT * FROM (VALUES
  ('Memorize Addition', 'Education', 'Math', 'Addition facts 1-10, animated, number line & multiple choice', '➕', 'from-indigo-300 to-cyan-500', '/math-tables'),
  ('Memorize Subtraction', 'Education', 'Math', 'Subtraction facts 1-10, animated, number line & multiple choice', '➖', 'from-indigo-300 to-cyan-500', '/math-tables'),
  ('Memorize Multiplication', 'Education', 'Math', 'Multiplication tables 1-10, animated & multiple choice', '✖️', 'from-indigo-300 to-cyan-500', '/math-tables'),
  ('Memorize Division', 'Education', 'Math', 'Division facts 1-10, animated', '➗', 'from-indigo-300 to-cyan-500', '/math-tables')
) AS new_apps(name, category, subcategory, description, icon_emoji, color_scheme, route)
WHERE NOT EXISTS (
  SELECT 1 FROM "mywayapps-applications" existing WHERE existing.name = new_apps.name
);
