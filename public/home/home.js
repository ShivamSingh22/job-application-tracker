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

  document.getElementById('search-btn').addEventListener('click', searchApplications);
  document.getElementById('filter-btn').addEventListener('click', filterApplications);
});

async function searchApplications() {
  const token = localStorage.getItem('token');
  const searchTerm = document.getElementById('search-input').value;

  try {
    const response = await axios.get('http://localhost:8080/job-applications/search', {
      headers: { 'Authorization': token },
      params: { search: searchTerm }
    });
    displayJobApplications(response.data);
  } catch (error) {
    console.error('Error searching job applications:', error);
  }
}

async function filterApplications() {
  const token = localStorage.getItem('token');
  const status = document.getElementById('status-filter').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  try {
    const response = await axios.get('http://localhost:8080/job-applications/filter', {
      headers: { 'Authorization': token },
      params: { status, startDate, endDate }
    });
    displayJobApplications(response.data);
  } catch (error) {
    console.error('Error filtering job applications:', error);
  }
}

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
        <h5 class="mb-1">${app.jobTitle}</h5>
        <small class="text-muted">${app.status}</small>
      </div>
      <p class="mb-1">${app.companyName}</p>
      <small>Applied on: ${new Date(app.applicationDate).toLocaleDateString()}</small>
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
