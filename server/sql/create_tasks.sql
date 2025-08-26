CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    due_at TIMESTAMP,


    -- Tracking task outcome
    completed_at TIMESTAMP,
    cancelled BOOLEAN DEFAULT FALSE,
    failure_reason TEXT,

    original_instruction TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
);