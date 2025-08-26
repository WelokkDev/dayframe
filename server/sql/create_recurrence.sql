CREATE TABLE recurrence_rules (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    
    -- Core pattern (Patterns 1,2)
    frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')) NOT NULL,
    interval_value INTEGER DEFAULT 1, -- every X days/weeks/months (Pattern 2)
    
    -- Count-based (Pattern 3)
    occurrences_per_period INTEGER, -- "4 times a week" = 4
    
    -- Specific days (Pattern 5)
    days_of_week INTEGER[], -- [1,3,5] for Mon,Wed,Fri
    
    -- Day positions (Pattern 7) 
    week_of_month INTEGER, -- 1=first, 2=second, 3=third, 4=fourth, -1=last
    day_of_month INTEGER, -- for monthly: 15th = 15
    
    -- Time specific (Pattern 8)
    preferred_time TIME, -- 7am = '07:00'
    time_range_start TIME,   -- "between 2-4pm"
    time_range_end TIME,
    
    -- End conditions
    end_date DATE,
    end_after_occurrences INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW()
);