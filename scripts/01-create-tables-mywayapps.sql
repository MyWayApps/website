-- Drop existing tables if they exist (clean slate)
DROP TABLE IF EXISTS "mywayapps-user_scores" CASCADE;
DROP TABLE IF EXISTS "mywayapps-user_progress" CASCADE;
DROP TABLE IF EXISTS "mywayapps-applications" CASCADE;
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

-- Create mywayapps-applications table
CREATE TABLE "mywayapps-applications" (
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

-- Create mywayapps-user_progress table
CREATE TABLE "mywayapps-user_progress" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES "mywayapps-user"(id) ON DELETE CASCADE,
  application_id UUID REFERENCES "mywayapps-applications"(id) ON DELETE CASCADE,
  best_score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  game_data JSONB DEFAULT '{}',
  UNIQUE(user_id, application_id)
);

-- Create mywayapps-user_scores table
CREATE TABLE "mywayapps-user_scores" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES "mywayapps-user"(id) ON DELETE CASCADE,
  application_id UUID REFERENCES "mywayapps-applications"(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  completion_time INTEGER,
  difficulty_level VARCHAR(50),
  game_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_mywayapps_user_email ON "mywayapps-user"(email);
CREATE INDEX idx_mywayapps_user_name ON "mywayapps-user"(name);
CREATE INDEX idx_mywayapps_applications_category ON "mywayapps-applications"(category);
CREATE INDEX idx_mywayapps_user_progress_user_id ON "mywayapps-user_progress"(user_id);
CREATE INDEX idx_mywayapps_user_progress_application_id ON "mywayapps-user_progress"(application_id);
CREATE INDEX idx_mywayapps_user_scores_user_id ON "mywayapps-user_scores"(user_id);
CREATE INDEX idx_mywayapps_user_scores_application_id ON "mywayapps-user_scores"(application_id);

-- Insert sample applications
INSERT INTO "mywayapps-applications" (name, category, subcategory, description, icon_emoji, color_scheme, route) VALUES
('Skip Counting Game', 'Education', 'Math', 'Learn skip counting by 2, 3, 5, and 10 with fun pictures!', '🔢', 'from-yellow-300 to-amber-500', '/skip-counting'),
('Number Sequence', 'Education', 'Math', 'Practice ascending and descending number patterns', '📈', 'from-blue-300 to-indigo-500', '/number-sequence'),
('Telugu Letters', 'Education', 'Telugu', 'Learn Telugu alphabet with interactive games', 'అ', 'from-green-300 to-teal-500', '/telugu-letters'),
('English Phonics', 'Education', 'English', 'Master English sounds and pronunciation', '🔤', 'from-purple-300 to-pink-500', '/english-phonics'),
('Shape Puzzle', 'Puzzles', 'Geometry', 'Identify and match different shapes', '🔺', 'from-red-300 to-orange-500', '/shape-puzzle'),
('Memory Game', 'Games', 'Memory', 'Test your memory with colorful cards', '🧠', 'from-cyan-300 to-blue-500', '/memory-game'),
('Addition Practice', 'Education', 'Math', 'Practice basic addition with visual aids', '➕', 'from-green-300 to-blue-500', '/addition-practice'),
('Subtraction Game', 'Education', 'Math', 'Learn subtraction through interactive games', '➖', 'from-orange-300 to-red-500', '/subtraction-game'),
('Color Recognition', 'Education', 'Art', 'Learn colors with fun activities', '🎨', 'from-pink-300 to-purple-500', '/color-recognition'),
('Animal Sounds', 'Education', 'Science', 'Match animals with their sounds', '🐄', 'from-yellow-300 to-green-500', '/animal-sounds')
ON CONFLICT (name) DO NOTHING;

-- Insert some demo users for testing
INSERT INTO "mywayapps-user" (name, email, age, grade) VALUES
('Demo Student', 'demo@mywayapps.com', 8, '3rd Grade'),
('Test Child', 'test@mywayapps.com', 6, '1st Grade'),
('Sample User', 'sample@mywayapps.com', 10, '5th Grade')
ON CONFLICT (email) DO NOTHING;
