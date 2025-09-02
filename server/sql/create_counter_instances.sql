CREATE TABLE counter_instances (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    actions_left INTEGER NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    cancelled_at BOOLEAN DEFAULT FALSE,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
