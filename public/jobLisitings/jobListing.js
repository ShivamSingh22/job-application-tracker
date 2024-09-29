document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '../login/login.html';
      return;
    }
  
    fetchJobListings();
  
    document.getElementById('logout-link').addEventListener('click', logout);
    document.getElementById('add-job-listing-btn').addEventListener('click', showAddJobListingForm);
    document.getElementById('job-listing-form').addEventListener('submit', submitJobListing);
  });
  
  async function fetchJobListings() {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get('http://localhost:8080/job-listings', {
        headers: { 'Authorization': token }
      });
      displayJobListings(response.data);
    } catch (error) {
      console.error('Error fetching job listings:', error);
    }
  }
  
  function displayJobListings(jobListings) {
    const container = document.getElementById('job-listings-list');
    container.innerHTML = '';
    jobListings.forEach(listing => {
      const listingElement = document.createElement('div');
      listingElement.className = 'list-group-item';
      listingElement.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${listing.title}</h5>
          <small>${listing.company}</small>
        </div>
        <p class="mb-1">${listing.location || 'Location not specified'}</p>
        <p class="mb-1">Salary: ${listing.salary || 'Not specified'}</p>
        <p class="mb-1">Deadline: ${listing.applicationDeadline ? new Date(listing.applicationDeadline).toLocaleDateString() : 'Not specified'}</p>
        <small>${listing.description || 'No description provided'}</small>
        <div class="mt-2">
          <a href="${listing.jobUrl}" target="_blank" class="btn btn-sm btn-outline-primary">View Job</a>
          <button class="btn btn-sm btn-outline-secondary edit-job-listing" data-id="${listing.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-job-listing" data-id="${listing.id}">Delete</button>
        </div>
      `;
      container.appendChild(listingElement);
    });
  
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-job-listing').forEach(button => {
      button.addEventListener('click', () => editJobListing(button.dataset.id));
    });
    document.querySelectorAll('.delete-job-listing').forEach(button => {
      button.addEventListener('click', () => deleteJobListing(button.dataset.id));
    });
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
  }
  
  function showAddJobListingForm() {
    document.getElementById('job-listing-form-container').style.display = 'block';
    document.getElementById('job-listing-form').reset();
    document.getElementById('job-listing-form').dataset.mode = 'add';
  }
  
  async function submitJobListing(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    //creates a form data type of object key value pair
    const formData = new FormData(event.target);

    //transforms a list of key value pairs into an object
    const jobListingData = Object.fromEntries(formData.entries());

    //retrieves the mode of the form i.e add or edit
    const mode = event.target.dataset.mode;
  
    try {
      if (mode === 'add') {
        await axios.post('http://localhost:8080/job-listings', jobListingData, {
          headers: { 'Authorization': token }
        });
      } else if (mode === 'edit') {
        const jobListingId = event.target.dataset.jobListingId;
        await axios.put(`http://localhost:8080/job-listings/${jobListingId}`, jobListingData, {
          headers: { 'Authorization': token }
        });
      }
      
      alert('Job listing saved successfully!');
      document.getElementById('job-listing-form').reset();
      document.getElementById('job-listing-form-container').style.display = 'none';
      fetchJobListings();
    } catch (error) {
      console.error('Error saving job listing:', error);
      alert('Failed to save job listing. Please try again.');
    }
  }
  
  async function editJobListing(jobListingId) {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get(`http://localhost:8080/job-listings/${jobListingId}`, {
        headers: { 'Authorization': token }
      });
      const jobListing = response.data;
  
      document.getElementById('title').value = jobListing.title;
      document.getElementById('company').value = jobListing.company;
      document.getElementById('location').value = jobListing.location || '';
      document.getElementById('description').value = jobListing.description || '';
      document.getElementById('salary').value = jobListing.salary || '';
      document.getElementById('applicationDeadline').value = jobListing.applicationDeadline ? jobListing.applicationDeadline.split('T')[0] : '';
      document.getElementById('jobUrl').value = jobListing.jobUrl || '';
  
      document.getElementById('job-listing-form').dataset.mode = 'edit';
      document.getElementById('job-listing-form').dataset.jobListingId = jobListingId;
      document.getElementById('job-listing-form-container').style.display = 'block';
    } catch (error) {
      console.error('Error fetching job listing details:', error);
      alert('Failed to fetch job listing details. Please try again.');
    }
  }
  
  async function deleteJobListing(jobListingId) {
    if (confirm('Are you sure you want to delete this job listing?')) {
      const token = localStorage.getItem('token');
  
      try {
        await axios.delete(`http://localhost:8080/job-listings/${jobListingId}`, {
          headers: { 'Authorization': token }
        });
        alert('Job listing deleted successfully!');
        fetchJobListings();
      } catch (error) {
        console.error('Error deleting job listing:', error);
        alert('Failed to delete job listing. Please try again.');
      }
    }
  }