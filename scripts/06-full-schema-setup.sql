-- Full, correct schema + seed for MyWayApps' Supabase-backed persistence.
--
-- Why this file exists: testConnection() (lib/database-supabase.ts) checks
-- for a table named "mywayapps-applications" — that table has never existed
-- live, so testConnection() has always returned false and the whole app has
-- been running in offline/localStorage-only mode. Separately, scripts 01
-- (three conflicting versions), 02, 03 and 04 in this folder don't agree with
-- each other or with what lib/database-supabase.ts / lib/question-history.ts
-- actually query (checked directly against the code, not the old scripts).
-- This file is the corrected, consolidated version — run this INSTEAD of
-- 01/02/03/04/05, not in addition to them.
--
-- Only mywayapps_user is left untouched — it already exists live and works
-- (IF NOT EXISTS guards it below just in case, but nothing here alters it).
--
-- Design choice: application_id columns below are TEXT, not UUID, and have NO
-- foreign key to mywayapps-applications. Two reasons: (1) it lets every app's
-- id here exactly match the string ids already used in app/page.tsx's
-- fallbackApplications catalogue (e.g. "2" for Clock Reading), so switching
-- from offline to connected mode doesn't orphan a child's existing progress
-- under a new id; (2) it lets comprehension-lesson pages keep using synthetic
-- ids like "hindi-comprehension-lesson-1-game1" that don't have (and don't
-- need) a matching catalogue row, same as they already do in localStorage.
--
-- Run this in the Supabase SQL editor.

CREATE TABLE IF NOT EXISTS mywayapps_user (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  age INTEGER,
  grade VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- The exact table testConnection() checks for.
CREATE TABLE IF NOT EXISTS "mywayapps-applications" (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  icon_emoji VARCHAR(10),
  color_scheme VARCHAR(100),
  route VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mywayapps_user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES mywayapps_user(id) ON DELETE CASCADE,
  application_id TEXT NOT NULL,
  best_score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  game_data JSONB DEFAULT '{}',
  UNIQUE(user_id, application_id)
);

CREATE TABLE IF NOT EXISTS mywayapps_user_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES mywayapps_user(id) ON DELETE CASCADE,
  application_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  completion_time INTEGER,
  difficulty_level VARCHAR(50),
  game_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS mywayapps_user_question_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES mywayapps_user(id) ON DELETE CASCADE,
  game_key VARCHAR(255) NOT NULL,
  question_signature VARCHAR(255) NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mywayapps_user_email ON mywayapps_user(email);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_name ON mywayapps_user(name);
CREATE INDEX IF NOT EXISTS idx_mywayapps_applications_category ON "mywayapps-applications"(category);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_progress_user_id ON mywayapps_user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_progress_application_id ON mywayapps_user_progress(application_id);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_scores_user_id ON mywayapps_user_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_scores_application_id ON mywayapps_user_scores(application_id);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_subject_progress_user_id ON mywayapps_user_subject_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_question_history_user_game ON mywayapps_user_question_history(user_id, game_key);

-- Seed data — copied verbatim from app/page.tsx's fallbackApplications array
-- (the actual catalogue every page renders from), same ids, so nothing
-- orphans once the app switches from offline to connected mode.
INSERT INTO "mywayapps-applications" (id, name, category, subcategory, description, icon_emoji, color_scheme, route) VALUES
  ('1', 'Number Sequence', 'Education', 'Math', 'Counting, before/after, place value, comparisons & more', '📈', 'from-blue-200 to-indigo-400', '/number-sequence'),
  ('2', 'Clock Reading', 'Education', 'Math', 'Learn to read clocks with interactive games', '🕰️', 'from-purple-200 to-pink-500', '/clock-reading'),
  ('3', 'Even & Odd Numbers', 'Education', 'Math', 'Learn even and odd numbers with fun sorting games!', '⚖️', 'from-green-200 to-teal-500', '/even-odd'),
  ('4', 'Skip Counting Game', 'Education', 'Math', 'Learn skip counting by 2, 3, 5, and 10 with fun pictures!', '⏩', 'from-yellow-200 to-amber-400', '/skip-counting'),
  ('math-3', 'Addition', 'Education', 'Math', '1, 2 & 3-digit addition — numbers and word problems', '➕', 'from-green-300 to-teal-500', '/math-addition'),
  ('math-4', 'Subtraction', 'Education', 'Math', '1, 2 & 3-digit subtraction — numbers and word problems', '➖', 'from-orange-300 to-rose-500', '/math-subtraction'),
  ('math-5', 'Multiplication', 'Education', 'Math', '1, 2 & 3-digit multiplication — numbers and word problems', '✖️', 'from-violet-300 to-fuchsia-500', '/math-multiplication'),
  ('math-6', 'Division', 'Education', 'Math', '1, 2 & 3-digit division — numbers and word problems', '➗', 'from-sky-300 to-cyan-500', '/math-division'),
  ('math-11', 'Memorize Tables', 'Education', 'Math', 'Addition, subtraction & multiplication facts 1-10, animated and in order', '🔢', 'from-indigo-300 to-cyan-500', '/math-tables'),
  ('math-7', 'Shapes', 'Education', 'Math', 'Identify flat & solid shapes, sort them, and match to real life', '🔺', 'from-green-300 to-teal-500', '/math-shapes'),
  ('math-8', 'Fractions', 'Education', 'Math', 'Simple & mixed fractions — identify, compare, and shade', '🥧', 'from-violet-300 to-fuchsia-500', '/math-fractions'),
  ('math-9', 'Money', 'Education', 'Math', 'Indian Rupees & Paise — identify, count, and compare', '💰', 'from-sky-300 to-cyan-500', '/math-money'),
  ('math-10', 'Measurement', 'Education', 'Math', 'Compare length, weight, capacity, and measure with everyday units', '📏', 'from-orange-300 to-amber-400', '/math-measurement'),
  ('math-12', 'Patterns', 'Education', 'Math', 'Spot repeating patterns, fill the gap, and count on number patterns', '🧩', 'from-pink-300 to-red-500', '/math-patterns'),

  ('5', 'Telugu Letters', 'Education', 'Telugu', 'Learn Telugu alphabet with flashcards and games', 'అ', 'from-yellow-200 to-amber-400', '/telugu-letters'),
  ('7', 'Telugu Gunintaalu', 'Education', 'Telugu', 'Learn Telugu consonant combinations with matras', 'క', 'from-blue-200 to-indigo-400', '/telugu-gunintaalu'),
  ('8', 'Telugu Words', 'Education', 'Telugu', 'Learn Telugu words through interactive games', '📖', 'from-purple-200 to-pink-500', '/telugu-words'),
  ('13', 'Telugu Vocabulary', 'Education', 'Telugu', 'Learn Telugu vocabulary - Days, Colours, Animals & more!', '📚', 'from-green-200 to-teal-500', '/telugu-vocabulary'),
  ('14', 'Telugu Vottulu', 'Education', 'Telugu', 'Learn Telugu subscripts (Vottulu) with flashcards and games', 'వ', 'from-pink-200 to-pink-500', '/telugu-vottulu'),
  ('17', 'Telugu Comprehension', 'Education', 'Telugu', 'Read Telugu stories and test your understanding!', '📖', 'from-cyan-200 to-blue-400', '/telugu-comprehension'),
  ('te-wg', 'Telugu Word Games', 'Education', 'Telugu', 'Picture Vocabulary, Word Search & Crossword', '🧩', 'from-teal-300 to-cyan-500', '/word-games/telugu'),
  ('te-poems', 'Telugu Poems', 'Education', 'Telugu', 'Simple traditional rhymes — script and audio', '📜', 'from-rose-300 to-fuchsia-500', '/poems/telugu'),
  ('te-sent', 'Telugu Sentences', 'Education', 'Telugu', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/sentences/telugu'),
  ('15', 'Telugu Satakamalu', 'Education', 'Telugu', 'Read classic Telugu Satakamalu with meanings', '📜', 'from-amber-200 to-orange-400', '/telugu-satakamalu'),
  ('16', 'Telugu Podupu Kathalu', 'Education', 'Telugu', 'Test your brain with fun Telugu riddles!', '🧩', 'from-orange-200 to-red-400', '/telugu-riddles'),

  ('hi-1', 'Hindi Letters', 'Education', 'Hindi', 'Learn Hindi alphabet (वर्णमाला) with flashcards and games', 'अ', 'from-blue-200 to-indigo-400', '/hindi-letters'),
  ('hi-4', 'Hindi Barakhadi', 'Education', 'Hindi', 'Learn Hindi consonant-vowel combinations (बारहखड़ी)', 'क', 'from-blue-200 to-indigo-400', '/hindi-barakhadi'),
  ('hi-2', 'Hindi Vocabulary', 'Education', 'Hindi', 'Learn Hindi vocabulary - Days, Colours, Animals & more!', '📚', 'from-purple-200 to-pink-500', '/hindi-vocabulary'),
  ('hi-3', 'Hindi Comprehension', 'Education', 'Hindi', 'Read Hindi stories and test your understanding!', '📖', 'from-green-200 to-teal-500', '/hindi-comprehension'),
  ('hi-wg', 'Hindi Word Games', 'Education', 'Hindi', 'Picture Vocabulary, Word Search & Crossword', '🧩', 'from-teal-300 to-cyan-500', '/word-games/hindi'),
  ('hi-poems', 'Hindi Poems', 'Education', 'Hindi', 'Simple traditional rhymes — script and audio', '📜', 'from-rose-300 to-fuchsia-500', '/poems/hindi'),
  ('hi-sent', 'Hindi Sentences', 'Education', 'Hindi', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/sentences/hindi'),

  ('kn-1', 'Kannada Letters', 'Education', 'Kannada', 'Learn Kannada alphabet (ವರ್ಣಮಾಲೆ) with flashcards and games', 'ಅ', 'from-yellow-200 to-amber-400', '/kannada-letters'),
  ('kn-4', 'Kannada Gunitakshara', 'Education', 'Kannada', 'Learn Kannada consonant-vowel combinations (ಗುಣಿತಾಕ್ಷರಗಳು)', 'ಕ', 'from-blue-200 to-indigo-400', '/kannada-gunitakshara'),
  ('kn-2', 'Kannada Vocabulary', 'Education', 'Kannada', 'Learn Kannada vocabulary - Days, Colours, Animals & more!', '📚', 'from-green-300 to-teal-500', '/kannada-vocabulary'),
  ('kn-3', 'Kannada Comprehension', 'Education', 'Kannada', 'Read Kannada stories and test your understanding!', '📖', 'from-orange-300 to-rose-500', '/kannada-comprehension'),
  ('kn-wg', 'Kannada Word Games', 'Education', 'Kannada', 'Picture Vocabulary, Word Search & Crossword', '🧩', 'from-teal-300 to-cyan-500', '/word-games/kannada'),
  ('kn-poems', 'Kannada Poems', 'Education', 'Kannada', 'Simple traditional rhymes — script and audio', '📜', 'from-rose-300 to-fuchsia-500', '/poems/kannada'),
  ('kn-sent', 'Kannada Sentences', 'Education', 'Kannada', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/sentences/kannada'),

  ('ta-1', 'Tamil Letters', 'Education', 'Tamil', 'Learn Tamil alphabet (தமிழ் எழுத்துக்கள்) with flashcards and games', 'அ', 'from-violet-300 to-fuchsia-500', '/tamil-letters'),
  ('ta-4', 'Tamil Uyirmei', 'Education', 'Tamil', 'Learn Tamil consonant-vowel combinations (உயிர்மெய் எழுத்துக்கள்)', 'க', 'from-blue-200 to-indigo-400', '/tamil-uyirmei'),
  ('ta-2', 'Tamil Vocabulary', 'Education', 'Tamil', 'Learn Tamil vocabulary - Days, Colours, Animals & more!', '📚', 'from-sky-300 to-cyan-500', '/tamil-vocabulary'),
  ('ta-3', 'Tamil Comprehension', 'Education', 'Tamil', 'Read Tamil stories and test your understanding!', '📖', 'from-blue-200 to-indigo-400', '/tamil-comprehension'),
  ('ta-wg', 'Tamil Word Games', 'Education', 'Tamil', 'Picture Vocabulary, Word Search & Crossword', '🧩', 'from-teal-300 to-cyan-500', '/word-games/tamil'),
  ('ta-poems', 'Tamil Poems', 'Education', 'Tamil', 'Simple traditional rhymes — script and audio', '📜', 'from-rose-300 to-fuchsia-500', '/poems/tamil'),
  ('ta-sent', 'Tamil Sentences', 'Education', 'Tamil', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/sentences/tamil'),

  ('ml-1', 'Malayalam Letters', 'Education', 'Malayalam', 'Learn Malayalam alphabet (മലയാള അക്ഷരമാല) with flashcards and games', 'അ', 'from-purple-200 to-pink-500', '/malayalam-letters'),
  ('ml-4', 'Malayalam Chertthezhuthu', 'Education', 'Malayalam', 'Learn Malayalam consonant-vowel combinations (ചേർത്തെഴുത്ത്)', 'ക', 'from-blue-200 to-indigo-400', '/malayalam-chertthezhuthu'),
  ('ml-2', 'Malayalam Vocabulary', 'Education', 'Malayalam', 'Learn Malayalam vocabulary - Days, Colours, Animals & more!', '📚', 'from-green-200 to-teal-500', '/malayalam-vocabulary'),
  ('ml-3', 'Malayalam Comprehension', 'Education', 'Malayalam', 'Read Malayalam stories and test your understanding!', '📖', 'from-yellow-200 to-amber-400', '/malayalam-comprehension'),
  ('ml-wg', 'Malayalam Word Games', 'Education', 'Malayalam', 'Picture Vocabulary, Word Search & Crossword', '🧩', 'from-teal-300 to-cyan-500', '/word-games/malayalam'),
  ('ml-poems', 'Malayalam Poems', 'Education', 'Malayalam', 'Simple traditional rhymes — script and audio', '📜', 'from-rose-300 to-fuchsia-500', '/poems/malayalam'),
  ('ml-sent', 'Malayalam Sentences', 'Education', 'Malayalam', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/sentences/malayalam'),

  ('sa-0', 'Sanskrit Letters', 'Education', 'Sanskrit', 'Learn the Sanskrit alphabet with flashcards and games', 'ॐ', 'from-yellow-200 to-amber-400', '/sanskrit-letters'),
  ('sa-3', 'Sanskrit Barakhadi', 'Education', 'Sanskrit', 'Learn Sanskrit consonant-vowel combinations (बारहखड़ी)', 'क', 'from-blue-200 to-indigo-400', '/sanskrit-barakhadi'),
  ('sa-1', 'Sanskrit Vocabulary', 'Education', 'Sanskrit', 'Learn Sanskrit vocabulary - Days, Colours, Animals & more!', '📚', 'from-green-300 to-teal-500', '/sanskrit-vocabulary'),
  ('sa-2', 'Sanskrit Comprehension', 'Education', 'Sanskrit', 'Read Sanskrit stories and test your understanding!', '📖', 'from-orange-300 to-rose-500', '/sanskrit-comprehension'),
  ('sa-wg', 'Sanskrit Word Games', 'Education', 'Sanskrit', 'Picture Vocabulary, Word Search & Crossword', '🧩', 'from-teal-300 to-cyan-500', '/word-games/sanskrit'),
  ('sa-poems', 'Sanskrit Poems', 'Education', 'Sanskrit', 'A simple classic subhashita — script and audio', '📜', 'from-rose-300 to-fuchsia-500', '/poems/sanskrit'),
  ('sa-sent', 'Sanskrit Sentences', 'Education', 'Sanskrit', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/sentences/sanskrit'),

  ('12', 'English Spelling Game Suite', 'Education', 'English', 'Master spelling with 10 fun interactive games!', '✨', 'from-blue-200 to-indigo-400', '/spelling-game-suite'),
  ('en-4', 'English Sentences', 'Education', 'English', 'Build, type, and listen to sentences!', '📝', 'from-cyan-200 to-blue-500', '/english-sentences'),
  ('en-2', 'English Grammar', 'Education', 'English', 'Watch and learn nouns, verbs, adjectives & more', '🎬', 'from-purple-200 to-pink-500', '/english-grammar'),
  ('en-3', 'English Reading Coach', 'Education', 'English', 'Read a story out loud and get instant feedback', '🎤', 'from-amber-200 to-orange-500', '/english-reading'),

  ('sci-1', 'Science', 'Education', 'Science', 'Watch and learn about plants, animals & living things', '🔬', 'from-emerald-300 to-green-600', '/science'),
  ('sci-2', 'Food & Nutrients', 'Education', 'Science', 'Learn about food, nutrition and the nutrients that keep us healthy', '🍎', 'from-orange-300 to-red-500', '/food-and-nutrients'),

  ('ss-1', 'Social Studies', 'Education', 'Social Studies', 'Learn about India''s symbols, festivals & famous people', '🏛️', 'from-indigo-300 to-violet-600', '/social-studies'),

  ('11', 'Cooking Recipes', 'Education', 'Life Skills', 'Learn cooking skills with fun recipes!', '🥗', 'from-yellow-200 to-amber-400', '/cooking-recipes'),

  ('10m', 'Memory Game', 'Games', '', 'Test your memory with colorful cards', '🧠', 'from-blue-200 to-indigo-500', '/memory-game'),
  ('10c', 'Catch Me', 'Games', '', 'Click the animals to score points!', '🐰', 'from-purple-200 to-pink-500', '/counting-game'),
  ('10s', 'Sudoku', 'Games', '', '4x4 and 6x6 puzzles with numbers or pictures', '🧩', 'from-cyan-200 to-blue-500', '/sudoku'),
  ('10k', 'Kolam', 'Games', '', 'Draw traditional Indian kolam designs around the dots', '🌸', 'from-rose-200 to-fuchsia-500', '/kolam'),
  ('10d', 'Spot the Difference', 'Games', '', 'Find what''s different between two pictures!', '🔍', 'from-orange-200 to-red-500', '/spot-the-difference'),
  ('10i', 'Indian Board Games', 'Games', '', 'Play Chowka Bara and Puli Meka!', '🎲', 'from-amber-200 to-orange-500', '/indian-board-games')
ON CONFLICT (id) DO NOTHING;
