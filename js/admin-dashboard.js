// Admin Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user || user.role !== 'full_admin') {
        alert('Access denied. Full Admin privileges required.');
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = user.name;
    
    // Initialize dashboard
    initializeDashboard();
});

// Initialize Dashboard
function initializeDashboard() {
    loadTasksData();
    updateStatistics();
    initializeCharts();
    loadTasksTable();
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Add active class to clicked menu item
    event.target.closest('.menu-item').classList.add('active');
}

// Load tasks data from localStorage
function loadTasksData() {
    const savedState = localStorage.getItem('onboardingChecklistState');
    return savedState ? JSON.parse(savedState) : { tasks: {}, checklists: {} };
}

// Update Statistics
function updateStatistics() {
    const state = loadTasksData();
    const totalTasks = 17;
    let completedTasks = 0;
    
    // Count completed tasks
    Object.keys(state.tasks || {}).forEach(taskId => {
        if (state.tasks[taskId].completed) {
            completedTasks++;
        }
    });
    
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Update stats
    document.getElementById('totalTasksStat').textContent = totalTasks;
    document.getElementById('completedTasksStat').textContent = completedTasks;
    document.getElementById('pendingTasksStat').textContent = pendingTasks;
    document.getElementById('completionRate').textContent = completionRate + '%';
}

// Initialize Charts
let tasksByStageChart, completionStatusChart, progressOverTimeChart, priorityChart;

function initializeCharts() {
    initTasksByStageChart();
    initCompletionStatusChart();
    initProgressOverTimeChart();
    initPriorityChart();
}

function initTasksByStageChart() {
    const ctx = document.getElementById('tasksByStageChart');
    if (!ctx) return;
    
    tasksByStageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Offer Extended', 'Due First Week', 'Application Signed', 'Due before Start', '30 Days', '60 Days', '90 Days'],
            datasets: [{
                label: 'Tasks',
                data: [2, 5, 4, 3, 1, 1, 1],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function initCompletionStatusChart() {
    const ctx = document.getElementById('completionStatusChart');
    if (!ctx) return;
    
    const state = loadTasksData();
    const totalTasks = 17;
    let completedTasks = 0;
    
    Object.keys(state.tasks || {}).forEach(taskId => {
        if (state.tasks[taskId].completed) {
            completedTasks++;
        }
    });
    
    completionStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [completedTasks, totalTasks - completedTasks],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function initProgressOverTimeChart() {
    const ctx = document.getElementById('progressOverTimeChart');
    if (!ctx) return;
    
    progressOverTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Completion %',
                data: [0, 25, 45, 60],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function initPriorityChart() {
    const ctx = document.getElementById('priorityChart');
    if (!ctx) return;
    
    priorityChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['High', 'Medium', 'Low'],
            datasets: [{
                data: [0, 17, 0], // All current tasks are medium priority
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load Tasks Table
function loadTasksTable() {
    const tbody = document.getElementById('tasksTableBody');
    if (!tbody) return;
    
    const state = loadTasksData();
    const tasks = getTasksMetadata();
    
    tbody.innerHTML = '';
    
    tasks.forEach(task => {
        const isCompleted = state.tasks[task.id]?.completed || false;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.bucket}</td>
            <td><span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span></td>
            <td>${task.assignedTo}</td>
            <td><span class="badge ${isCompleted ? 'badge-completed' : 'badge-pending'}">${isCompleted ? 'Completed' : 'Pending'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit" onclick="editTask('${task.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteTask('${task.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Get tasks metadata
function getTasksMetadata() {
    return [
        { id: 'task-1', name: 'Send Application for Employment', bucket: 'Offer Extended', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-2', name: 'Send Offer of Employment', bucket: 'Offer Extended', priority: 'Medium', assignedTo: 'Jason Cecco' },
        { id: 'task-3', name: 'Task Kristen to Setup ADP', bucket: '🎯 Due First Week', priority: 'Medium', assignedTo: 'Vinny Naccarelli, Jason Cecco' },
        { id: 'task-4', name: 'Onboarding Marketing Meeting', bucket: '🎯 Due First Week', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-5', name: 'Marketing Checklist', bucket: '🎯 Due First Week', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-6', name: 'Transition', bucket: '🎯 Due First Week', priority: 'Medium', assignedTo: 'Jason Cecco' },
        { id: 'task-7', name: 'Team Culture', bucket: '🎯 Due First Week', priority: 'Medium', assignedTo: 'Jason Cecco' },
        { id: 'task-8', name: 'Onboarding Docs & Forms', bucket: 'Application Signed', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-9', name: 'IMPORTANT DATES', bucket: 'Application Signed', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-10', name: 'New User Equipment & Credentials Setup', bucket: 'Application Signed', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-11', name: 'Legal', bucket: 'Application Signed', priority: 'Medium', assignedTo: 'Jason Cecco' },
        { id: 'task-12', name: 'Confirm Onboarding Docs are Signed and Filed', bucket: '💡 Due before Start Date', priority: 'Medium', assignedTo: 'Vinny Naccarelli' },
        { id: 'task-13', name: 'Technology', bucket: '💡 Due before Start Date', priority: 'Medium', assignedTo: 'Matt Pfrommer' },
        { id: 'task-14', name: '90 Day Plan', bucket: '💡 Due before Start Date', priority: 'Medium', assignedTo: 'N/A' },
        { id: 'task-15', name: 'Schedule 30 day check in for Dept Leaders', bucket: '🎉 30 Days In', priority: 'Medium', assignedTo: 'Matt Pfrommer' },
        { id: 'task-16', name: 'Schedule 60 day check in for Dept Leaders', bucket: '🤝 60 Day Update', priority: 'Medium', assignedTo: 'Matt Pfrommer' },
        { id: 'task-17', name: 'Ask employee for onboarding feedback', bucket: '💹 90 Day Update', priority: 'Medium', assignedTo: 'Vinny Naccarelli' }
    ];
}

// Filter Admin Tasks
function filterAdminTasks() {
    const searchQuery = document.getElementById('adminSearchInput').value.toLowerCase();
    const bucketFilter = document.getElementById('adminBucketFilter').value;
    const tasks = getTasksMetadata();
    const tbody = document.getElementById('tasksTableBody');
    const rows = tbody.getElementsByTagName('tr');
    
    Array.from(rows).forEach((row, index) => {
        const task = tasks[index];
        if (!task) return;
        
        let shouldShow = true;
        
        if (searchQuery && !task.name.toLowerCase().includes(searchQuery)) {
            shouldShow = false;
        }
        
        if (bucketFilter !== 'all' && task.bucket !== bucketFilter) {
            shouldShow = false;
        }
        
        row.style.display = shouldShow ? '' : 'none';
    });
}

// Edit Task
function editTask(taskId) {
    const tasks = getTasksMetadata();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('editTaskId').value = taskId;
    document.getElementById('editTaskName').value = task.name;
    document.getElementById('editTaskPriority').value = task.priority;
    document.getElementById('editTaskStage').value = task.bucket;
    document.getElementById('editTaskAssignee').value = task.assignedTo;
    
    document.getElementById('editTaskModal').classList.add('active');
}

function closeEditTaskModal() {
    document.getElementById('editTaskModal').classList.remove('active');
}

function saveTaskEdit(event) {
    event.preventDefault();
    
    const taskId = document.getElementById('editTaskId').value;
    const taskName = document.getElementById('editTaskName').value;
    const priority = document.getElementById('editTaskPriority').value;
    const stage = document.getElementById('editTaskStage').value;
    const assignee = document.getElementById('editTaskAssignee').value;
    const dueDate = document.getElementById('editTaskDueDate').value;
    
    // Update task metadata (in a real app, this would save to database)
    showNotification(`Task "${taskName}" updated successfully!`, 'success');
    
    closeEditTaskModal();
    loadTasksTable();
}

// Delete Task
function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
        // Delete task (in a real app, this would delete from database)
        showNotification('Task deleted successfully!', 'success');
        loadTasksTable();
    }
}

// Add New Task
function showAddTaskModal() {
    document.getElementById('addTaskModal').classList.add('active');
}

function closeAddTaskModal() {
    document.getElementById('addTaskModal').classList.remove('active');
    document.getElementById('addTaskForm').reset();
}

function saveNewTask(event) {
    event.preventDefault();
    
    const taskName = document.getElementById('newTaskName').value;
    const priority = document.getElementById('newTaskPriority').value;
    const stage = document.getElementById('newTaskStage').value;
    const assignee = document.getElementById('newTaskAssignee').value;
    const dueDate = document.getElementById('newTaskDueDate').value;
    const description = document.getElementById('newTaskDescription').value;
    
    // Add new task (in a real app, this would save to database)
    showNotification(`Task "${taskName}" created successfully!`, 'success');
    
    closeAddTaskModal();
    loadTasksTable();
    updateStatistics();
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

// Handle window resize for charts
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Charts will auto-resize with responsive: true
        if (tasksByStageChart) tasksByStageChart.resize();
        if (completionStatusChart) completionStatusChart.resize();
        if (progressOverTimeChart) progressOverTimeChart.resize();
        if (priorityChart) priorityChart.resize();
    }, 250);
});
