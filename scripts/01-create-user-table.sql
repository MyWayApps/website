-- Create the mywayapps-user table
CREATE TABLE IF NOT EXISTS "mywayapps-user" (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INTEGER,
  grade VARCHAR(50),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_email ON "mywayapps-user"(email);
CREATE INDEX IF NOT EXISTS idx_mywayapps_user_name ON "mywayapps-user"(name);

-- Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS applications (
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
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES "mywayapps-user"(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  best_score INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  streak_count INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '[]',
  game_data JSONB DEFAULT '{}',
  UNIQUE(user_id, application_id)
);

-- Create user_scores table for individual game sessions
CREATE TABLE IF NOT EXISTS user_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES "mywayapps-user"(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  completion_time INTEGER, -- in seconds
  difficulty_level VARCHAR(50),
  game_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_application_id ON user_progress(application_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_user_id ON user_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_application_id ON user_scores(application_id);
