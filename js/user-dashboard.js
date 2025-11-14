// User Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user || user.role !== 'user') {
        alert('Access denied. User privileges required.');
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = user.name;
    
    // Initialize dashboard
    initializeUserDashboard();
});

// Initialize User Dashboard
function initializeUserDashboard() {
    loadMyTasks();
    updateUserStatistics();
}

// Get user's assigned tasks
function getUserAssignedTasks() {
    const user = getCurrentUser();
    const assignedTaskIds = user.assignedTasks || [];
    
    const allTasks = [
        { id: 'task-4', name: 'Onboarding Marketing Meeting', bucket: '🎯 Due First Week', description: 'Meet with marketing team to set up your marketing materials and campaigns', checklistCount: 6 },
        { id: 'task-5', name: 'Marketing Checklist', bucket: '🎯 Due First Week', description: 'Complete marketing onboarding checklist items', checklistCount: 6 },
        { id: 'task-8', name: 'Onboarding Docs & Forms', bucket: 'Application Signed', description: 'Complete and sign all required onboarding documents', checklistCount: 7 },
        { id: 'task-13', name: 'Technology', bucket: '💡 Due before Start Date', description: 'Set up your technology accounts and systems', checklistCount: 8 },
        { id: 'task-14', name: '90 Day Plan', bucket: '💡 Due before Start Date', description: 'Review your 90-day onboarding plan', checklistCount: 8 }
    ];
    
    return allTasks.filter(task => assignedTaskIds.includes(task.id));
}

// Load my tasks
function loadMyTasks() {
    const tasksList = document.getElementById('myTasksList');
    const myTasks = getUserAssignedTasks();
    const state = loadTasksData();
    
    if (myTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No Tasks Assigned</h3>
                <p>You don't have any tasks assigned yet. Please contact your manager.</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = '';
    
    myTasks.forEach(task => {
        const isCompleted = state.tasks[task.id]?.completed || false;
        const checklistState = state.checklists[task.id] || {};
        
        // Count completed checklist items
        let completedItems = 0;
        Object.values(checklistState).forEach(checked => {
            if (checked) completedItems++;
        });
        
        const progressPercent = task.checklistCount > 0 
            ? Math.round((completedItems / task.checklistCount) * 100) 
            : 0;
        
        const taskCard = document.createElement('div');
        taskCard.className = `user-task-card ${isCompleted ? 'completed' : ''}`;
        taskCard.dataset.taskId = task.id;
        
        taskCard.innerHTML = `
            <div class="task-card-header">
                <div class="task-title-area">
                    <input type="checkbox" 
                           class="task-checkbox-large" 
                           ${isCompleted ? 'checked' : ''}
                           onchange="toggleUserTaskComplete('${task.id}')">
                    <div>
                        <div class="task-title">${task.name}</div>
                        <span class="task-stage-badge">${task.bucket}</span>
                    </div>
                </div>
            </div>
            <div class="task-card-details">
                <div class="task-description">${task.description}</div>
                ${task.checklistCount > 0 ? `
                <div class="task-progress-bar">
                    <div class="progress-bar-label">
                        <span>Checklist Items</span>
                        <span>${completedItems}/${task.checklistCount}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        tasksList.appendChild(taskCard);
    });
}

// Load tasks data from localStorage
function loadTasksData() {
    const savedState = localStorage.getItem('onboardingChecklistState');
    return savedState ? JSON.parse(savedState) : { tasks: {}, checklists: {} };
}

// Update user statistics
function updateUserStatistics() {
    const myTasks = getUserAssignedTasks();
    const state = loadTasksData();
    const totalTasks = myTasks.length;
    let completedTasks = 0;
    
    myTasks.forEach(task => {
        if (state.tasks[task.id]?.completed) {
            completedTasks++;
        }
    });
    
    const pendingTasks = totalTasks - completedTasks;
    const completionPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update stats
    document.getElementById('totalUserTasks').textContent = totalTasks;
    document.getElementById('completedUserTasks').textContent = completedTasks;
    document.getElementById('pendingUserTasks').textContent = pendingTasks;
    document.getElementById('progressPercent').textContent = completionPercent + '%';
    
    // Update progress circle
    updateProgressCircle(completionPercent);
}

// Update progress circle
function updateProgressCircle(percent) {
    const circle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 45; // radius is 45
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

// Toggle user task complete
function toggleUserTaskComplete(taskId) {
    const state = loadTasksData();
    
    if (!state.tasks[taskId]) {
        state.tasks[taskId] = { completed: false, expanded: false };
    }
    
    state.tasks[taskId].completed = !state.tasks[taskId].completed;
    
    localStorage.setItem('onboardingChecklistState', JSON.stringify(state));
    
    showNotification(
        state.tasks[taskId].completed 
            ? 'Task marked as complete! Great job! 🎉' 
            : 'Task marked as incomplete',
        state.tasks[taskId].completed ? 'success' : 'info'
    );
    
    loadMyTasks();
    updateUserStatistics();
}

// Notification System
function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
