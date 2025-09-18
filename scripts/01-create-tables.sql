-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_scores CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS "mywayapps-user" CASCADE;

-- Create the mywayapps-user table
CREATE TABLE "mywayapps-user" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  grade VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  icon_emoji VARCHAR(10),
  color_scheme VARCHAR(100),
  route VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES "mywayapps-user"(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  best_score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  game_data JSONB DEFAULT '{}',
  UNIQUE(user_id, application_id)
);

-- Create user_scores table
CREATE TABLE user_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES "mywayapps-user"(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  completion_time INTEGER,
  difficulty_level VARCHAR(50),
  game_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_mywayapps_user_email ON "mywayapps-user"(email);
CREATE INDEX idx_mywayapps_user_name ON "mywayapps-user"(name);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_application_id ON user_progress(application_id);
CREATE INDEX idx_user_scores_user_id ON user_scores(user_id);
CREATE INDEX idx_user_scores_application_id ON user_scores(application_id);

-- Insert initial applications
INSERT INTO applications (name, category, subcategory, description, icon_emoji, color_scheme, route) VALUES
('Skip Counting Game', 'Education', 'Math', 'Learn skip counting by 2, 3, 5, and 10 with fun pictures!', '🔢', 'from-yellow-200 to-amber-400', '/skip-counting'),
('Number Sequence', 'Education', 'Math', 'Practice ascending and descending number patterns', '📈', 'from-blue-300 to-indigo-500', '/number-sequence'),
('Telugu Letters', 'Education', 'Telugu', 'Learn Telugu alphabet with interactive games', 'అ', 'from-green-300 to-teal-500', '/telugu-letters'),
('English Phonics', 'Education', 'English', 'Master English sounds and pronunciation', '🔤', 'from-purple-300 to-pink-500', '/english-phonics'),
('Shape Puzzle', 'Puzzles', 'Geometry', 'Identify and match different shapes', '🔺', 'from-red-300 to-orange-500', '/shape-puzzle'),
('Memory Game', 'Games', 'Memory', 'Test your memory with colorful cards', '🧠', 'from-cyan-300 to-blue-500', '/memory-game');
