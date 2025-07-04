-- Insert initial applications
INSERT INTO applications (name, category, subcategory, description, icon_emoji, color_scheme, route) VALUES
('Skip Counting Game', 'Education', 'Math', 'Learn skip counting by 2, 3, 5, and 10 with fun pictures!', '🔢', 'from-yellow-300 to-amber-500', '/skip-counting'),
('Number Sequence', 'Education', 'Math', 'Practice ascending and descending number patterns', '📈', 'from-blue-300 to-indigo-500', '/number-sequence'),
('Telugu Letters', 'Education', 'Telugu', 'Learn Telugu alphabet with interactive games', 'అ', 'from-green-300 to-teal-500', '/telugu-letters'),
('English Phonics', 'Education', 'English', 'Master English sounds and pronunciation', '🔤', 'from-purple-300 to-pink-500', '/english-phonics'),
('Shape Puzzle', 'Puzzles', 'Geometry', 'Identify and match different shapes', '🔺', 'from-red-300 to-orange-500', '/shape-puzzle'),
('Memory Game', 'Games', 'Memory', 'Test your memory with colorful cards', '🧠', 'from-cyan-300 to-blue-500', '/memory-game')
ON CONFLICT DO NOTHING;
