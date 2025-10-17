// Dashboard-specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeCharts();
    updateTime();
    setInterval(updateTime, 1000); // Update time every second
});

function initializeDashboard() {
    // Initialize dashboard-specific functionality
    console.log('Dashboard initialized');
}

function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Revenue (₹)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Popular Dishes Chart
    const popularDishesCtx = document.getElementById('popularDishesChart');
    if (popularDishesCtx) {
        new Chart(popularDishesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Butter Chicken', 'Masala Dosa', 'Paneer Tikka', 'Chicken Biryani', 'Dal Tadka'],
                datasets: [{
                    data: [25, 20, 18, 15, 12],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    // Peak Hours Chart
    const peakHoursCtx = document.getElementById('peakHoursChart');
    if (peakHoursCtx) {
        new Chart(peakHoursCtx, {
            type: 'bar',
            data: {
                labels: ['8AM', '10AM', '12PM', '2PM', '4PM', '6PM', '8PM'],
                datasets: [{
                    label: 'Orders',
                    data: [45, 78, 120, 95, 65, 110, 85],
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Quick action functions
function generateReport() {
    showAlert('Generating report... This may take a few moments.', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showAlert('Report generated successfully! Check your downloads folder.', 'success');
    }, 3000);
}

function exportData() {
    showAlert('Exporting data... Please wait.', 'info');
    
    // Simulate data export
    setTimeout(() => {
        showAlert('Data exported successfully!', 'success');
    }, 2000);
}

// Real-time data updates (simulated)
function updateMetrics() {
    // Simulate real-time metric updates
    const metrics = document.querySelectorAll('.metric-number');
    
    metrics.forEach(metric => {
        const currentValue = parseInt(metric.textContent.replace(/[^\d]/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
        const newValue = Math.max(0, currentValue + change);
        
        // Animate the change
        animateNumber(metric, currentValue, newValue);
    });
}

function animateNumber(element, start, end) {
    const duration = 1000;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// Update metrics every 30 seconds
setInterval(updateMetrics, 30000);

// Dashboard refresh functionality
function refreshDashboard() {
    showAlert('Refreshing dashboard data...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        updateMetrics();
        showAlert('Dashboard refreshed successfully!', 'success');
    }, 2000);
}

// Add refresh button functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add refresh button to dashboard header
    const dashboardHeader = document.querySelector('.dashboard-header .container .row');
    if (dashboardHeader) {
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-outline-light btn-sm ms-3';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Refresh';
        refreshBtn.onclick = refreshDashboard;
        
        const timeContainer = dashboardHeader.querySelector('.col-md-4');
        if (timeContainer) {
            timeContainer.appendChild(refreshBtn);
        }
    }
});

// Keyboard shortcuts for dashboard
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R to refresh dashboard
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
    
    // Ctrl/Cmd + E to export data
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportData();
    }
});

// Auto-refresh functionality
let autoRefreshInterval;

function startAutoRefresh(interval = 60000) { // Default 1 minute
    autoRefreshInterval = setInterval(updateMetrics, interval);
    showAlert('Auto-refresh enabled (every ' + (interval/1000) + ' seconds)', 'info');
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        showAlert('Auto-refresh disabled', 'info');
    }
}

// Initialize auto-refresh on page load
document.addEventListener('DOMContentLoaded', function() {
    startAutoRefresh(30000); // 30 seconds
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
