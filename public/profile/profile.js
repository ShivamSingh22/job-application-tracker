document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../login/login.html';
        return;
    }

    fetchProfile();

    document.getElementById('logout-link').addEventListener('click', logout);
    document.getElementById('profile-form').addEventListener('submit', updateProfile);
});

async function fetchProfile() {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get('http://localhost:8080/profile', {
            headers: { 'Authorization': token }
        });
        displayProfile(response.data);
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function displayProfile(profile) {
    document.getElementById('username').value = profile.username;
    document.getElementById('email').value = profile.email;
    document.getElementById('firstName').value = profile.firstName || '';
    document.getElementById('lastName').value = profile.lastName || '';
    document.getElementById('careerGoals').value = profile.careerGoals || '';
}

async function updateProfile(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const updatedProfile = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        careerGoals: document.getElementById('careerGoals').value
    };

    try {
        const response = await axios.put('http://localhost:8080/profile', updatedProfile, {
            headers: { 'Authorization': token }
        });
        alert('Profile updated successfully!');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../login/login.html';
}
