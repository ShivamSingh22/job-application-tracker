document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to access the dashboard');
        window.location.href = '../login/login.html';
        return;
    }
    fetchDashboardData();
});

async function fetchDashboardData() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:8080/dashboard/getDashboardData', {
            headers: { 'Authorization': token }
        });
        console.log('Dashboard data:', response.data);
        const dashboardData = response.data;
        renderStatusChart(dashboardData.statusCounts);
        renderTimelineChart(dashboardData.timelineData);
        renderRecentApplications(dashboardData.recentApplications);
    } catch (error) {
        console.error('Error fetching dashboard data:', error.response ? error.response.data : error.message);
    }
}

function renderStatusChart(statusCounts) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Application Status Distribution'
            }
        }
    });
}

function renderTimelineChart(timelineData) {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Applications',
                data: timelineData.map(item => ({x: item.date, y: item.count})),
                borderColor: '#36A2EB',
                fill: false
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Applications Over Time'
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Applications'
                    }
                }
            }
        }
    });
}

function renderRecentApplications(recentApplications) {
    const container = document.getElementById('recentApplications');
    container.innerHTML = '';
    recentApplications.forEach(app => {
        const appElement = document.createElement('div');
        appElement.className = 'recent-application';
        appElement.innerHTML = `
            <h6>${app.jobTitle} at ${app.companyName}</h6>
            <p>Status: ${app.status}</p>
            <p>Applied on: ${new Date(app.applicationDate).toLocaleDateString()}</p>
        `;
        container.appendChild(appElement);
    });
}