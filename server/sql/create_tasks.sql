CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    start_date DATE,
    end_date DATE, -- will often be same as start date
    
    -- Repeat logic
    repeat_is_true BOOLEAN DEFAULT FALSE,
    repeat_interval INTEGER, -- e.g., every 1 week
    repeat_unit TEXT CHECK (repeat_unit IN ('day', 'week', 'month')),
    repeat_ends_on DATE, -- null = never ends
    
    -- Tracking task outcome
    completed_at TIMESTAMP,
    cancelled BOOLEAN DEFAULT FALSE,
    failure_reason TEXT,

    parent_task_id INTEGER REFERENCES tasks(id) -- for duplicates / instances
);