const OpenAI = require('openai');
const pool = require('../db');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to parse natural language into structured task data
async function parseTaskFromText(userInput, userId) {
  // Get current date for context
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  const prompt = `
You are a task parsing assistant. Parse the following natural language input into a structured task format.

CURRENT DATE: ${currentDate}

Input: "${userInput}"

IMPORTANT RULES:
1. If the input is ambiguous or unclear (e.g., "help me", "I need to do stuff"), respond with an error asking for clarification
2. The title should be the actual action (e.g., "Buy Groceries", "Write Essay", "Call Mom")
3. Support these specific patterns:

ONE-TIME TASKS WITH DUE DATES:
   - "Buy groceries tomorrow" → due_at: calculated tomorrow date, no recurrence
   - "Submit report by Friday 5pm" → due_at: calculated next Friday date, preferred_time: "17:00", no recurrence
   - "Finish my essay by 8pm on Monday" → due_at: calculated next Monday date, preferred_time: "20:00", no recurrence
   - "Go to work tomorrow" → due_at: calculated tomorrow date, no recurrence
   - "Buy eggs tomorrow" → due_at: calculated tomorrow date, no recurrence

RECURRING TASKS:
   - "Every month pay rent" → frequency: "monthly", interval_value: 1, day_of_month: 1
   - "Every three weeks visit parents" → frequency: "weekly", interval_value: 3
   - "Every two days call parents" → frequency: "daily", interval_value: 2
   - "Go to gym 4 times a week" → frequency: "weekly", interval_value: 1, occurrences_per_period: 4
   - "Every Monday do laundry" → frequency: "weekly", interval_value: 1, days_of_week: [1]
   - "Drink coffee at 6am on weekdays" → frequency: "weekly", interval_value: 1, days_of_week: [1,2,3,4,5], preferred_time: "06:00"

DATE CALCULATION RULES:
- Calculate dates relative to today (${currentDate})
- "tomorrow" = next day after ${currentDate}
- "Monday" = next Monday after ${currentDate}
- "Friday" = next Friday after ${currentDate}
- "next week" = 7 days from ${currentDate}
- Always ensure calculated dates are in the future
- NEVER use past dates, IF you feel compelled to, ask the user for clarification
- For one-time tasks: set due_at to the calculated date, do NOT set recurrence fields
- For recurring tasks: do NOT set due_at, use recurrence fields instead
- When time is not specified along with date, set the time to 11:59pm of that date

Return a JSON object with the following structure:
{
  "tasks": [
    {
      "title": "Clear, concise task title (the actual action)",
      "category": "category name (if mentioned, otherwise null)",
      "due_at": "YYYY-MM-DD for one-time tasks with specific due dates, or null for recurring tasks",
      "recurrence": {
        "frequency": "daily/weekly/monthly for recurring tasks, or null for one-time tasks",
        "interval_value": "number (default 1) or null",
        "occurrences_per_period": "number for 'X times per period' or null",
        "days_of_week": "[1,2,3,4,5,6,7] for days (1=Monday, 7=Sunday) or null",
        "week_of_month": "1-4 for week position, -1 for last, or null",
        "day_of_month": "1-31 for day of month or null",
        "preferred_time": "HH:MM or null",
        "time_range_start": "HH:MM or null",
        "time_range_end": "HH:MM or null",
        "end_date": "YYYY-MM-DD or null",
        "end_after_occurrences": "number or null"
      }
    }
  ],
  "interpretation": "Brief summary of what tasks were created"
}

IMPORTANT: For one-time tasks, set due_at and leave recurrence.frequency as null. For recurring tasks, set recurrence.frequency and leave due_at as null.

If the input is ambiguous, return:
{
  "error": "Please provide more specific details about what you need to do. For example: 'Remind me to buy groceries on Sunday' or 'Create a task to study for my exam tomorrow'"
}

Parse the input and return only the JSON object:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that parses natural language into structured task data. Always return valid JSON. If the input is ambiguous, return an error object asking for clarification."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    
    // Check if AI returned an error for ambiguous input
    if (parsedData.error) {
      throw new Error(parsedData.error);
    }
    
    if (!parsedData.tasks || !Array.isArray(parsedData.tasks)) {
      throw new Error('AI response must contain a tasks array');
    }

    // Validate that due dates are not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    for (const task of parsedData.tasks) {
      if (task.due_at) {
        const dueDate = new Date(task.due_at);
        if (dueDate < today) {
          throw new Error(`Invalid due date: ${task.due_at} is in the past. Please specify a future date.`);
        }
      }
    }

    const cleanedTasks = parsedData.tasks.map(task => ({
      title: task.title || 'Untitled Task',
      category: task.category || null,
      due_at: task.due_at || null,
      recurrence: {
        frequency: task.recurrence?.frequency || null,
        interval_value: task.recurrence?.interval_value || 1,
        occurrences_per_period: task.recurrence?.occurrences_per_period || null,
        days_of_week: task.recurrence?.days_of_week || null,
        week_of_month: task.recurrence?.week_of_month || null,
        day_of_month: task.recurrence?.day_of_month || null,
        preferred_time: task.recurrence?.preferred_time || null,
        time_range_start: task.recurrence?.time_range_start || null,
        time_range_end: task.recurrence?.time_range_end || null,
        end_date: task.recurrence?.end_date || null,
        end_after_occurrences: task.recurrence?.end_after_occurrences || null
      },
      original_instruction: userInput
    }));

    // Validate and clean the data
    return {
      tasks: cleanedTasks,
      interpretation: parsedData.interpretation || `Created ${cleanedTasks.length} task(s)`,
      originalInstruction: userInput
    };

  } catch (error) {
    console.error('AI parsing error:', error);
    throw error; // Re-throw the original error to preserve the message
  }
}

function combineDateAndTime(date, time) {
  if (!date) return null;
  if (time) {
    return `${date} ${time}:00`;
  } else {
    return `${date} 00:00:00`;
  }
}

async function generateNextTaskInstance(taskId, recurrence, client) {
  const now = new Date();
  console.log(`Generating next instance for task ${taskId} with recurrence:`, recurrence);
  console.log(`Current date: ${now.toISOString()}`);
  
  // Handle "N times per period" case (e.g., "go to gym 4 times a week")
  console.log(`Checking occurrences_per_period: ${recurrence.occurrences_per_period}, type: ${typeof recurrence.occurrences_per_period}`);
  if (recurrence.occurrences_per_period && recurrence.occurrences_per_period > 1) {
    console.log(`Generating ${recurrence.occurrences_per_period} instances for this period`);
    return await generateMultipleInstancesForPeriod(taskId, recurrence, client);
  }
  
  // Original logic for single instance generation
  let currentDate = new Date(now);
  let attempts = 0;
  const maxAttempts = 365; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    let shouldCreateInstance = false;
    
    switch (recurrence.frequency) {
      case 'daily':
        // For daily tasks, always create an instance
        shouldCreateInstance = true;
        break;
        
      case 'weekly':
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          // Specific days of week (1=Monday, 7=Sunday)
          const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
          shouldCreateInstance = recurrence.days_of_week.includes(dayOfWeek);
          console.log(`Weekly check: current day ${dayOfWeek}, allowed days ${recurrence.days_of_week}, should create: ${shouldCreateInstance}`);
        } else {
          // Every week on the same day (no specific days specified)
          // For now, create on the same day of week as today
          shouldCreateInstance = true;
        }
        break;
        
      case 'monthly':
        if (recurrence.day_of_month) {
          // Specific day of month (e.g., 15th of every month)
          shouldCreateInstance = currentDate.getDate() === recurrence.day_of_month;
        } else {
          // Same day of month as today (e.g., if today is 15th, create on 15th of next month)
          shouldCreateInstance = currentDate.getDate() === now.getDate();
        }
        break;
    }
    
    if (shouldCreateInstance) {
      const scheduledAt = recurrence.preferred_time 
        ? `${currentDate.toISOString().split('T')[0]} ${recurrence.preferred_time}:00`
        : `${currentDate.toISOString().split('T')[0]} 00:00:00`;
      
      // Check if this instance already exists
      const existingInstance = await client.query(
        `SELECT id FROM task_instances WHERE task_id = $1 AND scheduled_at = $2`,
        [taskId, scheduledAt]
      );
      
      if (existingInstance.rows.length === 0) {
        // Create the next instance
        await client.query(
          `INSERT INTO task_instances (task_id, scheduled_at) VALUES ($1, $2)`,
          [taskId, scheduledAt]
        );
        console.log(`Created task instance for task ${taskId} at ${scheduledAt}`);
        return scheduledAt;
      } else {
        console.log(`Instance already exists for ${scheduledAt}, moving to next date`);
      }
    }
    
    // Move to next date based on frequency and interval
    switch (recurrence.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + (recurrence.interval_value || 1));
        break;
      case 'weekly':
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          // For specific days, check each day until we find the next valid day
          currentDate.setDate(currentDate.getDate() + 1);
        } else {
          // For weekly without specific days, jump by interval weeks
          currentDate.setDate(currentDate.getDate() + 7 * (recurrence.interval_value || 1));
        }
        break;
      case 'monthly':
        // Move to next month
        currentDate.setMonth(currentDate.getMonth() + (recurrence.interval_value || 1));
        break;
    }
    
    attempts++;
  }
  
  // If we couldn't find a valid next instance, return null
  console.log(`Could not generate next task instance for task ${taskId} after ${attempts} attempts`);
  return null;
}

// Helper function to generate multiple instances for "N times per period"
async function generateMultipleInstancesForPeriod(taskId, recurrence, client) {
  const now = new Date();
  const instances = [];
  
  console.log(`generateMultipleInstancesForPeriod called with occurrences_per_period: ${recurrence.occurrences_per_period}`);
  
  // Calculate the end of the current period
  let periodEnd;
  switch (recurrence.frequency) {
    case 'weekly':
      // End of current week (Sunday at 23:59)
      periodEnd = new Date(now);
      const daysUntilSunday = 7 - periodEnd.getDay(); // 0 = Sunday, so this gives us days until next Sunday
      periodEnd.setDate(periodEnd.getDate() + daysUntilSunday);
      periodEnd.setHours(23, 59, 59, 999);
      break;
    case 'monthly':
      // End of current month
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'daily':
      // End of current day
      periodEnd = new Date(now);
      periodEnd.setHours(23, 59, 59, 999);
      break;
    default:
      throw new Error(`Unsupported frequency for multiple instances: ${recurrence.frequency}`);
  }
  
  console.log(`Period end: ${periodEnd.toISOString()}`);
  
  // Generate N instances, all due at the end of the period
  console.log(`Starting loop to create ${recurrence.occurrences_per_period} instances`);
  for (let i = 0; i < recurrence.occurrences_per_period; i++) {
    console.log(`Loop iteration ${i + 1}/${recurrence.occurrences_per_period}`);
    
    // Add a small offset to each instance to make them unique
    const instanceTime = new Date(periodEnd);
    instanceTime.setSeconds(instanceTime.getSeconds() + i); // Add i seconds to make each unique
    
    const scheduledAt = instanceTime.toISOString().replace('T', ' ').replace('Z', '');
    console.log(`Generated scheduledAt: ${scheduledAt}`);
    
    // Check if this instance already exists
    const existingInstance = await client.query(
      `SELECT id FROM task_instances WHERE task_id = $1 AND scheduled_at = $2`,
      [taskId, scheduledAt]
    );
    
    console.log(`Existing instances found: ${existingInstance.rows.length}`);
    
    if (existingInstance.rows.length === 0) {
      // Create the instance
      await client.query(
        `INSERT INTO task_instances (task_id, scheduled_at) VALUES ($1, $2)`,
        [taskId, scheduledAt]
      );
      instances.push(scheduledAt);
      console.log(`Created instance ${i + 1}/${recurrence.occurrences_per_period} for task ${taskId} at ${scheduledAt}`);
    } else {
      console.log(`Instance ${i + 1} already exists for ${scheduledAt}`);
    }
  }
  
  console.log(`Generated ${instances.length} instances for task ${taskId}`);
  return instances.length > 0 ? instances[0] : null; // Return the first instance time for compatibility
}

async function createTask(userId, taskData, client) {
  // Handle category lookup/creation
  let categoryId = null;
  if (taskData.category) {
    // First try to find existing category
    const categoryResult = await client.query(
      'SELECT id FROM categories WHERE name ILIKE $1 AND user_id = $2',
      [taskData.category, userId]
    );

    if (categoryResult.rows.length > 0) {
      categoryId = categoryResult.rows[0].id;
    } else {
      // Create new category if it doesn't exist
      const newCategoryResult = await client.query(
        'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id',
        [taskData.category, userId]
      );
      categoryId = newCategoryResult.rows[0].id;
    }
  }

  // Create the task
  const taskResult = await client.query(
    `INSERT INTO tasks (user_id, title, category_id, original_instruction) 
    VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, taskData.title, categoryId, taskData.original_instruction]
  );

  const task = taskResult.rows[0];
  console.log(`Created task ${task.id}: "${taskData.title}"`);
  console.log(`Task data:`, { due_at: taskData.due_at, recurrence: taskData.recurrence });

  // Create recurrence rule if specified
  let recurrenceRuleId = null;
  if (taskData.recurrence && taskData.recurrence.frequency) {
    const recurrenceResult = await client.query(
      `INSERT INTO recurrence_rules (
        task_id, frequency, interval_value, occurrences_per_period, days_of_week, week_of_month, 
        day_of_month, preferred_time, time_range_start, time_range_end, end_date, end_after_occurrences
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
       [
        task.id,
        taskData.recurrence.frequency,
        taskData.recurrence.interval_value,
        taskData.recurrence.occurrences_per_period,
        taskData.recurrence.days_of_week ? `{${taskData.recurrence.days_of_week.join(',')}}` : null,
        taskData.recurrence.week_of_month,
        taskData.recurrence.day_of_month,
        taskData.recurrence.preferred_time,
        taskData.recurrence.time_range_start,
        taskData.recurrence.time_range_end,
        taskData.recurrence.end_date,
        taskData.recurrence.end_after_occurrences
       ]
    );
    recurrenceRuleId = recurrenceResult.rows[0].id;
    console.log(`Created recurrence rule ${recurrenceRuleId} for task ${task.id}`);
  }

  // Generate task instances based on recurrence or single due date
  if (taskData.due_at) {
    // Single task instance with specific due date
    const scheduledAt = taskData.recurrence?.preferred_time 
      ? `${taskData.due_at} ${taskData.recurrence.preferred_time}:00`
      : `${taskData.due_at} 00:00:00`;

    console.log(`Creating single task instance for task ${task.id} at ${scheduledAt}`);
    
    await client.query(
      `INSERT INTO task_instances (task_id, scheduled_at) VALUES ($1, $2)`,
      [task.id, scheduledAt]
    );
    console.log(`Created single task instance for task ${task.id}`);
  } else if (recurrenceRuleId) {
    // Generate only the next instance for recurring tasks
    console.log(`Generating first instance for recurring task ${task.id} with recurrence:`, taskData.recurrence);
    const nextInstanceTime = await generateNextTaskInstance(task.id, taskData.recurrence, client);
    console.log(`Generated first instance for task ${task.id} at ${nextInstanceTime}`);
  }

  return task;
}

async function parseAndCreateTasks(userId, userInput) {
  if (!userInput || userInput.trim().length === 0) {
    throw new Error("Please provide a task description");
  }
  if (userInput.length > 500) {
    throw new Error("Input too long. Please keep it under 500 characters.");
  }

  const parsedData = await parseTaskFromText(userInput.trim(), userId);

  const client = await pool.connect();
  const createdTasks = [];

  try {
    await client.query('BEGIN');

    for (const taskData of parsedData.tasks) {
      const task = await createTask(userId, taskData, client);
      createdTasks.push(task);
    }

    await client.query('COMMIT');
    return {
      success: true,
      tasks: createdTasks,
      interpretation: parsedData.interpretation,
      originalInstruction: parsedData.originalInstruction
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error;
  } finally {
    client.release();
  }
}






module.exports = {
  parseTaskFromText,
  parseAndCreateTasks,
  createTask,
  generateNextTaskInstance
};