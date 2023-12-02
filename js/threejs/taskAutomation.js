// js/threejs/taskAutomation.js

class TaskAutomation {
  constructor() {
    this.automatedTasks = [];
  }

  automateTask(taskFunction, interval) {
    const task = setInterval(taskFunction, interval);
    this.automatedTasks.push(task);
    return task;
  }

  stopTask(task) {
    clearInterval(task);
    this.automatedTasks = this.automatedTasks.filter(t => t !== task);
  }

  stopAllTasks() {
    this.automatedTasks.forEach(clearInterval);
    this.automatedTasks = [];
  }
}

// Example of an automated task that could be used in the Elysium OS
function autoSaveProgress() {
  console.log('Progress saved automatically.');
  // Implementation to save user progress
}

// Instantiate the TaskAutomation class
const taskAutomationSystem = new TaskAutomation();

// Start an automated task with a given interval (e.g., 5 minutes)
const autoSaveTask = taskAutomationSystem.automateTask(autoSaveProgress, 300000);

// To stop the task, you can call stopTask with the returned task identifier
// taskAutomationSystem.stopTask(autoSaveTask);

// To stop all tasks, you can call stopAllTasks
// taskAutomationSystem.stopAllTasks();

// Export the task automation system for use in other modules
export { taskAutomationSystem };