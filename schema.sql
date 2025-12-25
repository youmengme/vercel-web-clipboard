-- Create clipboard_items table
CREATE TABLE IF NOT EXISTS clipboard_items (
  id VARCHAR(10) PRIMARY KEY,
  content TEXT NOT NULL,
  password VARCHAR(255),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for potential future queries
CREATE INDEX IF NOT EXISTS idx_created_at ON clipboard_items(created_at);
