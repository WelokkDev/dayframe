import { addDays, addWeeks, addMonths, setHours, setMinutes, format } from "date-fns";

/**
 * Calculate the next scheduled date for a recurring task
 * @param {Object} recurrence - The recurrence rules object
 * @param {Date} fromDate - Optional start date (defaults to current date)
 * @returns {Date|null} - The next scheduled date or null if no future occurrences
 */
export const getNextScheduledDate = (recurrence, fromDate = new Date()) => {
  if (!recurrence || !recurrence.frequency) {
    return null;
  }

  let currentDate = new Date(fromDate);
  let attempts = 0;
  const maxAttempts = 365; // Prevent infinite loops

  while (attempts < maxAttempts) {
    let shouldCreateInstance = false;

    switch (recurrence.frequency) {
      case 'daily':
        shouldCreateInstance = true;
        break;

      case 'weekly':
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
          shouldCreateInstance = recurrence.days_of_week.includes(dayOfWeek);
        } else {
          shouldCreateInstance = true;
        }
        break;

      case 'monthly':
        if (recurrence.day_of_month) {
          shouldCreateInstance = currentDate.getDate() === recurrence.day_of_month;
        } else {
          shouldCreateInstance = currentDate.getDate() === fromDate.getDate();
        }
        break;
    }

    if (shouldCreateInstance) {
      // Check if this date is in the future
      if (currentDate > fromDate) {
        let resultDate = new Date(currentDate);
        
        // Apply preferred time if specified
        if (recurrence.preferred_time) {
          const [hours, minutes] = recurrence.preferred_time.split(':');
          resultDate = setHours(resultDate, parseInt(hours));
          resultDate = setMinutes(resultDate, parseInt(minutes));
        } else {
          // Default to end of day (11:59 PM)
          resultDate = setHours(resultDate, 23);
          resultDate = setMinutes(resultDate, 59);
        }

        return resultDate;
      }
    }

    // Move to next date based on frequency and interval
    switch (recurrence.frequency) {
      case 'daily':
        currentDate = addDays(currentDate, recurrence.interval_value || 1);
        break;
      case 'weekly':
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          currentDate = addDays(currentDate, 1);
        } else {
          currentDate = addWeeks(currentDate, recurrence.interval_value || 1);
        }
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, recurrence.interval_value || 1);
        break;
    }

    attempts++;
  }

  return null;
};

/**
 * Get a human-readable description of the recurrence pattern
 * @param {Object} recurrence - The recurrence rules object
 * @returns {string} - Human-readable description
 */
export const getRecurrenceDescription = (recurrence) => {
  if (!recurrence || !recurrence.frequency) {
    return null;
  }

  const { frequency, interval_value, occurrences_per_period, days_of_week, day_of_month, preferred_time, end_date, end_after_occurrences } = recurrence;

  let description = '';

  // Frequency and interval
  if (occurrences_per_period && occurrences_per_period > 1) {
    description += `${occurrences_per_period} times per ${frequency}`;
  } else {
    const interval = interval_value > 1 ? `${interval_value} ${frequency}s` : frequency;
    description += `Every ${interval}`;
  }

  // Specific days of week
  if (days_of_week && days_of_week.length > 0) {
    const dayNames = days_of_week.map(day => {
      const dayMap = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' };
      return dayMap[day];
    });
    description += ` on ${dayNames.join(', ')}`;
  }

  // Specific day of month
  if (day_of_month) {
    const suffix = getDaySuffix(day_of_month);
    description += ` on the ${day_of_month}${suffix}`;
  }

  // Preferred time
  if (preferred_time) {
    const time = formatTime(preferred_time);
    description += ` at ${time}`;
  }

  // End conditions
  if (end_date) {
    description += ` until ${format(new Date(end_date), 'MMM d, yyyy')}`;
  } else if (end_after_occurrences) {
    description += ` for ${end_after_occurrences} occurrences`;
  } else {
    description += ' (repeats indefinitely)';
  }

  return description;
};

/**
 * Get the ordinal suffix for a day number
 * @param {number} day - The day number
 * @returns {string} - The ordinal suffix (st, nd, rd, th)
 */
export const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

/**
 * Format a time string to 12-hour format
 * @param {string} timeString - Time in HH:MM format
 * @returns {string} - Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes.padStart(2, '0')} ${ampm}`;
};

/**
 * Get multiple upcoming scheduled dates for a recurring task
 * @param {Object} recurrence - The recurrence rules object
 * @param {number} count - Number of upcoming dates to return
 * @param {Date} fromDate - Optional start date (defaults to current date)
 * @returns {Date[]} - Array of upcoming scheduled dates
 */
export const getUpcomingScheduledDates = (recurrence, count = 5, fromDate = new Date()) => {
  if (!recurrence || !recurrence.frequency) {
    return [];
  }

  const dates = [];
  let currentDate = new Date(fromDate);
  let attempts = 0;
  const maxAttempts = 365;

  while (dates.length < count && attempts < maxAttempts) {
    let shouldCreateInstance = false;

    switch (recurrence.frequency) {
      case 'daily':
        shouldCreateInstance = true;
        break;

      case 'weekly':
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
          shouldCreateInstance = recurrence.days_of_week.includes(dayOfWeek);
        } else {
          shouldCreateInstance = true;
        }
        break;

      case 'monthly':
        if (recurrence.day_of_month) {
          shouldCreateInstance = currentDate.getDate() === recurrence.day_of_month;
        } else {
          shouldCreateInstance = currentDate.getDate() === fromDate.getDate();
        }
        break;
    }

    if (shouldCreateInstance && currentDate > fromDate) {
      let resultDate = new Date(currentDate);
      
      if (recurrence.preferred_time) {
        const [hours, minutes] = recurrence.preferred_time.split(':');
        resultDate = setHours(resultDate, parseInt(hours));
        resultDate = setMinutes(resultDate, parseInt(minutes));
      } else {
        resultDate = setHours(resultDate, 23);
        resultDate = setMinutes(resultDate, 59);
      }

      dates.push(resultDate);
    }

    // Move to next date
    switch (recurrence.frequency) {
      case 'daily':
        currentDate = addDays(currentDate, recurrence.interval_value || 1);
        break;
      case 'weekly':
        if (recurrence.days_of_week && recurrence.days_of_week.length > 0) {
          currentDate = addDays(currentDate, 1);
        } else {
          currentDate = addWeeks(currentDate, recurrence.interval_value || 1);
        }
        break;
      case 'monthly':
        currentDate = addMonths(currentDate, recurrence.interval_value || 1);
        break;
    }

    attempts++;
  }
  

  return dates;
};

/**
 * Generate task instances for a specific task within a date range
 * @param {Object} task - Task object with recurrence rules
 * @param {Date} startDate - Start date for generation
 * @param {Date} endDate - End date for generation
 * @param {Array} existingInstances - Array of existing task instances to avoid duplicates
 * @returns {Array} Array of generated instance objects
 */
export const generateTaskInstancesForRange = (task, startDate, endDate, existingInstances = []) => {
  if (!task.recurrence || !task.recurrence.frequency) {
    return [];
  }

  // Get upcoming dates for this task
  const upcomingDates = getUpcomingScheduledDates(task.recurrence, 100, startDate);
  
  // Filter dates within the range
  const datesInRange = upcomingDates.filter(date => date >= startDate && date <= endDate);
  
  // Convert to instance objects and avoid duplicates
  const instances = datesInRange
    .filter(date => {
      // Check if there's already an existing instance for this task on this date
      return !existingInstances.some(existing => {
        const existingDate = new Date(existing.scheduled_at);
        return existing.task_id === task.id && 
               existingDate.toDateString() === date.toDateString();
      });
    })
    .map(date => ({
      id: `generated-${task.id}-${date.getTime()}`,
      task_id: task.id,
      title: task.title,
      importance: task.importance,
      scheduled_at: date.toISOString(),
      is_generated: true,
      recurrence: task.recurrence,
      category_id: task.category_id,
      original_instruction: task.original_instruction
    }));

  return instances;
};

/**
 * Generate all task instances for multiple tasks within a date range
 * @param {Array} tasks - Array of task objects
 * @param {Date} startDate - Start date for generation
 * @param {Date} endDate - End date for generation
 * @param {Array} existingInstances - Array of existing task instances to avoid duplicates
 * @returns {Array} Array of all generated instance objects
 */
export const generateAllTaskInstancesForRange = (tasks, startDate, endDate, existingInstances = []) => {
  const allInstances = [];
  
  console.log('=== generateAllTaskInstancesForRange ===');
  console.log('Tasks received:', tasks.length);
  console.log('Task IDs:', tasks.map(t => t.id));
  console.log('Task titles:', tasks.map(t => t.title));
  
  tasks.forEach(task => {
    if (task.recurrence && task.recurrence.frequency) {
      console.log(`Processing task: ${task.title} (ID: ${task.id})`);
      const taskInstances = generateTaskInstancesForRange(task, startDate, endDate, existingInstances);
      allInstances.push(...taskInstances);
    }
  });
  
  console.log('Total instances generated:', allInstances.length);
  console.log('=== End generateAllTaskInstancesForRange ===\n');
  
  return allInstances;
};