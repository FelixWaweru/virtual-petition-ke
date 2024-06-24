-- Create post table
CREATE TABLE IF NOT EXISTS petition (
    id TEXT NOT NULL PRIMARY KEY,
    created_at INTEGER NOT NULL,
    message TEXT NOT NULL,
    user_id TEXT NOT NULL,
    signature TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
