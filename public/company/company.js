document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '../login/login.html';
      return;
    }
  
    fetchCompanies();
  
    document.getElementById('logout-link').addEventListener('click', logout);
    document.getElementById('add-company-btn').addEventListener('click', showAddCompanyForm);
    document.getElementById('company-form').addEventListener('submit', submitCompany);
  });
  
  async function fetchCompanies() {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get('http://localhost:8080/companies', {
        headers: { 'Authorization': token }
      });
      displayCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }
  
  function displayCompanies(companies) {
    const container = document.getElementById('companies-list');
    container.innerHTML = '';
    companies.forEach(company => {
      const companyElement = document.createElement('div');
      companyElement.className = 'list-group-item';
      companyElement.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${company.name}</h5>
          <small>${company.industry || 'N/A'}</small>
        </div>
        <p class="mb-1">${company.website || 'No website provided'}</p>
        <p class="mb-1">Size: ${company.size || 'N/A'}</p>
        <p class="mb-1">Contact: ${company.contactPerson || 'N/A'}</p>
        <p class="mb-1">Email: ${company.contactEmail || 'N/A'}</p>
        <p class="mb-1">Phone: ${company.contactPhone || 'N/A'}</p>
        <small>${company.description || 'No description'}</small>
        <div class="mt-2">
          <button class="btn btn-sm btn-outline-primary edit-company" data-id="${company.id}">Edit</button>
          <button class="btn btn-sm btn-outline-danger delete-company" data-id="${company.id}">Delete</button>
        </div>
      `;
      container.appendChild(companyElement);
    });
  
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-company').forEach(button => {
      button.addEventListener('click', () => editCompany(button.dataset.id));
    });
    document.querySelectorAll('.delete-company').forEach(button => {
      button.addEventListener('click', () => deleteCompany(button.dataset.id));
    });
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
  }
  
  function showAddCompanyForm() {
    document.getElementById('company-form-container').style.display = 'block';
    document.getElementById('company-form').reset();
    document.getElementById('company-form').dataset.mode = 'add';
  }
  
  async function submitCompany(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(event.target);
    const companyData = Object.fromEntries(formData.entries());
    const mode = event.target.dataset.mode;
  
    try {
      if (mode === 'add') {
        await axios.post('http://localhost:8080/companies', companyData, {
          headers: { 'Authorization': token }
        });
      } else if (mode === 'edit') {
        const companyId = event.target.dataset.companyId;
        await axios.put(`http://localhost:8080/companies/${companyId}`, companyData, {
          headers: { 'Authorization': token }
        });
      }
      
      alert('Company information saved successfully!');
      document.getElementById('company-form').reset();
      document.getElementById('company-form-container').style.display = 'none';
      fetchCompanies();
    } catch (error) {
      console.error('Error saving company information:', error);
      alert('Failed to save company information. Please try again.');
    }
  }
  
  async function editCompany(companyId) {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get(`http://localhost:8080/companies/${companyId}`, {
        headers: { 'Authorization': token }
      });
      const company = response.data;
  
      document.getElementById('name').value = company.name;
      document.getElementById('website').value = company.website || '';
      document.getElementById('industry').value = company.industry || '';
      document.getElementById('size').value = company.size || '';
      document.getElementById('contactPerson').value = company.contactPerson || '';
      document.getElementById('contactEmail').value = company.contactEmail || '';
      document.getElementById('contactPhone').value = company.contactPhone || '';
      document.getElementById('description').value = company.description || '';
  
      document.getElementById('company-form').dataset.mode = 'edit';
      document.getElementById('company-form').dataset.companyId = companyId;
      document.getElementById('company-form-container').style.display = 'block';
    } catch (error) {
      console.error('Error fetching company details:', error);
      alert('Failed to fetch company details. Please try again.');
    }
  }
  
  async function deleteCompany(companyId) {
    if (confirm('Are you sure you want to delete this company?')) {
      const token = localStorage.getItem('token');
  
      try {
        await axios.delete(`http://localhost:8080/companies/${companyId}`, {
          headers: { 'Authorization': token }
        });
        alert('Company deleted successfully!');
        fetchCompanies();
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company. Please try again.');
      }
    }
  }