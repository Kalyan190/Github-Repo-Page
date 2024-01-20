const apiUrl = 'https://api.github.com/users/';
let currentPage = 1;
let perPage = 10;
let maxPerPage = 100;

// Function to fetch GitHub profile and repositories
function fetchUserProfile() {
    const inputUsername = $('#githubUsername').val();

    // If inputUsername is not provided, set the default username to "Kalyan190"
    const username = inputUsername || 'Kalyan190';

    fetchGitHubProfile(username);
    fetchRepositories(username);
}

// Function to handle "Enter" key press event
function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
        fetchUserProfile();
    }
}

// Event listener for "Enter" key press on the input field
$('#githubUsername').on('keypress', handleEnterKeyPress);

// Function to fetch GitHub profile
function fetchGitHubProfile(username) {
    const url = `${apiUrl}${username}`;

    $.ajax({
        url,
        method: 'GET',
        success: function (data) {
            displayGitHubProfile(data);
            fetchRepositories(username);
        },
        error: function (error) {
            console.error('Error fetching GitHub profile:', error);
        },
    });
}

// Function to fetch GitHub repositories
function fetchRepositories(username) {
    const url = `${apiUrl}${username}/repos?per_page=${perPage}&page=${currentPage}`;

    $('#repositories').empty().append('<div class="loader"></div>');

    $.ajax({
        url,
        method: 'GET',
        success: function (data) {
            displayRepositories(data);
            displayPagination(data.length);
        },
        error: function (error) {
            console.error('Error fetching repositories:', error);
            $('#repositories').empty().append('<p>Error fetching repositories. Please try again later.</p>');
        },
    });
}

// Function to display GitHub profile information
function displayGitHubProfile(profile) {
    $('#avatar').attr('src', profile.avatar_url);
    $('#name').text(profile.name || profile.login);
    $('#bio').text(profile.bio || 'Frontend Developer');
    $('#github-id').text(profile.login);
}

// Function to display GitHub repositories
function displayRepositories(repositories) {
    $('#repositories').empty();

    repositories.forEach(repository => {
        const repositoryHtml = `
            <div class="repository">
                <h3>${repository.name}</h3>
                <p>${repository.description || 'No description available'}</p>
            </div>
        `;
        $('#repositories').append(repositoryHtml);
    });
}

// Function to display pagination
function displayPagination(totalRepositories) {
    const totalPages = Math.ceil(totalRepositories / perPage);

    $('#pagination').empty();

    if (totalPages > 1) {
        for (let i = 1; i <= totalPages; i++) {
            const pageLink = `<a href="#" onclick="changePage(${i})">${i}</a>`;
            $('#pagination').append(pageLink);
        }
    }
}

// Function to change page
function changePage(page) {
    currentPage = page;
    fetchRepositories($('#githubUsername').val());
    updateActivePageStyle(page);

}

// Function to navigate to the previous page
function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchRepositories($('#githubUsername').val());
        updateActivePageStyle(currentPage);
    }
}

// Function to navigate to the next page
function nextPage() {
    // You may need to update this condition based on the total number of pages
    if (currentPage < 10) {
        currentPage++;
        fetchRepositories($('#githubUsername').val());
        updateActivePageStyle(currentPage);
    }
}


function updateActivePageStyle(currentPage) {
    $('.num span').removeClass('active'); // Remove 'active' class from all spans
    $(`.num span:nth-child(${currentPage + 1})`).addClass('active'); // Add 'active' class to the current page
}


// Initial fetch on page load
fetchUserProfile();