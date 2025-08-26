-- To be used for context
CREATE TABLE ai_conversations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    ai_response TEXT,
    tasks_created INTEGER[], -- array of task IDs created from this interaction
    created_at TIMESTAMP DEFAULT NOW()
);
