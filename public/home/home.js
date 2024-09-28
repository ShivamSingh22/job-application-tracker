document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../login/login.html';
    return;
  }

  fetchJobApplications();

  document.getElementById('logout-link').addEventListener('click', logout);
  document.getElementById('add-application-btn').addEventListener('click', showAddApplicationForm);
  document.getElementById('application-form').addEventListener('submit', submitApplication);
});

async function fetchJobApplications() {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get('http://localhost:8080/job-applications', {
      headers: { 'Authorization': token }
    });
    displayJobApplications(response.data);
  } catch (error) {
    console.error('Error fetching job applications:', error);
  }
}

function displayJobApplications(applications) {
  const container = document.getElementById('job-applications');
  container.innerHTML = '';
  applications.forEach(app => {
    const appElement = document.createElement('div');
    appElement.className = 'list-group-item';
    appElement.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1 job-title">${app.jobTitle}</h5>
        <small class="status-badge badge bg-${getStatusColor(app.status)}">${app.status}</small>
      </div>
      <p class="mb-1 company-name">${app.companyName}</p>
      <small class="text-muted">Applied on: ${new Date(app.applicationDate).toLocaleDateString()}</small>
      <p class="mt-2 notes">${app.notes || 'No notes'}</p>
      ${app.attachmentUrl ? `<a href="${app.attachmentUrl}" target="_blank">View Attachment</a>` : 'No attachment'}
    `;
    container.appendChild(appElement);
  });
}

function getStatusColor(status) {
  switch (status) {
    case 'applied': return 'primary';
    case 'interviewed': return 'info';
    case 'offered': return 'success';
    case 'rejected': return 'danger';
    default: return 'secondary';
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../login/login.html';
}

function showAddApplicationForm() {
  document.getElementById('application-form-container').style.display = 'block';
}

async function submitApplication(event) {
  event.preventDefault();
  const token = localStorage.getItem('token');

  const formData = new FormData(event.target);
  
  try {
    const response = await axios.post('http://localhost:8080/job-applications', formData, {
      headers: { 
        'Authorization': token,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    alert('Job application added successfully!');
    document.getElementById('application-form').reset();
    document.getElementById('application-form-container').style.display = 'none';
    fetchJobApplications();
  } catch (error) {
    console.error('Error adding job application:', error);
    alert('Failed to add job application. Please try again.');
  }
}
