-- Create clipboard_items table
CREATE TABLE IF NOT EXISTS clipboard_items (
  id VARCHAR(6) PRIMARY KEY,
  content TEXT NOT NULL,
  password VARCHAR(255),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for case-insensitive lookups
CREATE INDEX IF NOT EXISTS idx_id_lowercase ON clipboard_items(LOWER(id));

-- Create index on created_at for potential future queries
CREATE INDEX IF NOT EXISTS idx_created_at ON clipboard_items(created_at);
