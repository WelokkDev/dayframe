const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to parse natural language into structured task data
async function parseTaskFromText(userInput, userId) {
  // TODO: May need to parse into an ARRAY of tasks, to support user prompt asking for multiple tasks
  const prompt = `
You are a task parsing assistant. Parse the following natural language input into a structured task format.

Input: "${userInput}"

Return a JSON object with the following structure:
{
  "tasks": [
    "title": "Clear, concise task title",
    "category": "category name (if mentioned, otherwise null)",
    "due_at": "YYYY-MM-DD or null if not specified",
    "recurrence": {
      "frequency": "daily/weekly/monthly or null",
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
  ],
  "interpretation": "Brief summary of what tasks were created"

}

Examples:
- "Call mom every Sunday at 2pm" → frequency: "weekly", daysOfWeek: [7], preferredTime: "14:00"
- "Exercise every weekday morning" → frequency: "daily", daysOfWeek: [1,2,3,4,5], preferredTime: "08:00"
- "Pay rent on the 1st of every month" → frequency: "monthly", dayOfMonth: 1
- "Review budget every first Friday" → frequency: "monthly", weekOfMonth: 1, daysOfWeek: [5]

Parse the input and return only the JSON object:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that parses natural language into structured task data. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Low temperature for consistent parsing
      max_tokens: 700
    });

    const response = completion.choices[0].message.content;
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const parsedData = JSON.parse(jsonMatch[0]);
    
    if (!parsedData.tasks || !Array.isArray(parsedData.tasks)) {
      throw new Error('AI response must contain a tasks array');
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
    throw new Error('Failed to parse task from natural language');
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

async function createTask(userId, taskData, client) {

  const taskResult = await client.query(
    `INSERT INTO tasks (user_id, title, description, category_id, due_at) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, taskData.title, taskData.description, taskData.category_id, taskData.due_at]
  );

  const task = taskResult.rows[0];

  if (taskData.recurrence && taskData.recurrence.frequency) {
    await client.query(
      `INSERT INTO recurrence_rules (
        task_id, frequency, interval_value, occurrences_per_period, days_of_week, week_of_month, 
        day_of_month, preferred_time, time_range_start, time_range_end, end_date, end_after_occurrences
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
       [
        task.id,
        taskData.recurrence.frequency,
        taskData.recurrence.interval_value,
        taskData.recurrence.occurrences_per_period,
        taskData.recurrence.days_of_week,
        taskData.recurrence.week_of_month,
        taskData.recurrence.day_of_month,
        taskData.recurrence.preferred_time,
        taskData.recurrence.time_range_start,
        taskData.recurrence.time_range_end,
        taskData.recurrence.end_date,
        taskData.recurrence.end_after_occurrences
       ]
    )
  }
  return task;
}

async function parseAndCreateTasks(userId, userInput) {
  if (!userInput || userInput.trim().length === 0) {
    throw new Error("Please provide a task description");
  }
  if (userInput.length > 500) {
    throw new Errory("Input too long. Please keep it under 500 characters.")
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
  createTask
};