// Department Admin Dashboard JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    const user = checkAuth();
    if (!user || user.role !== 'dept_admin') {
        alert('Access denied. Department Admin privileges required.');
        window.location.href = 'login.html';
        return;
    }
    
    // Display user name
    document.getElementById('userName').textContent = user.name;
    
    // Initialize dashboard
    initializeDashboard();
});

// Initialize Dashboard (same as admin but with restricted permissions)
function initializeDashboard() {
    loadTasksData();
    updateStatistics();
    initializeCharts();
    loadTasksTable();
}

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(`${sectionName}-section`).classList.add('active');
    event.target.closest('.menu-item').classList.add('active');
}

function loadTasksData() {
    const savedState = localStorage.getItem('onboardingChecklistState');
    return savedState ? JSON.parse(savedState) : { tasks: {}, checklists: {} };
}

function updateStatistics() {
    const state = loadTasksData();
    const totalTasks = 17;
    let completedTasks = 0;
    
    Object.keys(state.tasks || {}).forEach(taskId => {
        if (state.tasks[taskId].completed) {
            completedTasks++;
        }
    });
    
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
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
                data: [0, 17, 0],
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

// Load Tasks Table (view-only with complete button)
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
                <button class="btn-icon btn-edit" onclick="toggleTaskComplete('${task.id}')" ${isCompleted ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> ${isCompleted ? 'Done' : 'Mark Complete'}
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

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

// Toggle task complete (only permission for dept admin)
function toggleTaskComplete(taskId) {
    const state = loadTasksData();
    
    if (!state.tasks[taskId]) {
        state.tasks[taskId] = { completed: false, expanded: false };
    }
    
    state.tasks[taskId].completed = true;
    
    localStorage.setItem('onboardingChecklistState', JSON.stringify(state));
    
    showNotification('Task marked as complete!', 'success');
    loadTasksTable();
    updateStatistics();
    
    // Update charts
    if (completionStatusChart) {
        completionStatusChart.destroy();
    }
    initCompletionStatusChart();
}

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

// Disabled functions for dept admin
function showAddTaskModal() {
    showNotification('You do not have permission to add tasks. Contact a Full Admin.', 'error');
}

function editTask() {
    showNotification('You do not have permission to edit tasks. Contact a Full Admin.', 'error');
}

function deleteTask() {
    showNotification('You do not have permission to delete tasks. Contact a Full Admin.', 'error');
}

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
