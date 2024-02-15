
// welcome.js

function searchJobs() {
    const searchTerm = document.getElementById('searchTerm').value;

    // Make an AJAX request to fetch job information
    fetch(`/jobs?term=${encodeURIComponent(searchTerm)}`)
        .then(response => response.json())
        .then(data => {
            // Call a function to display the job information on the page
            displayJobs(data);
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
        });
}

function displayJobs(data) {
    const jobs = data.jobs;

    const searchResultsContainer = document.getElementById('searchResultsContainer');

    // Clear existing content in the container
    searchResultsContainer.innerHTML = '';

    // Iterate through each job and create a box for it
    jobs.forEach(job => {
        const jobBox = document.createElement('div');
        jobBox.className = 'job-box';

        // Populate the job box with job information
        jobBox.innerHTML = `
            <h2>${job.name}</h2>
            <p>Email: paliyam@gmail.com</p>
            <p>Designation: ${job.designation}</p>
            <p>Job Description: ${job.jobDescription}</p>
            <p>Experience: ${job.experience}</p>
            <p>CTC: ${job.ctc}</p>
            <button class="apply-button" onclick="applyForJob('${job.name}')">Contact US:</button>
            <!-- Add more information as needed -->
            <hr>
        `;

        // Append the job box to the search results container
        searchResultsContainer.appendChild(jobBox);
    });
}

// Prevent form submission on button click
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    searchJobs();
});


// welcome.js

// Function to display to get when login to welcome page default jobs
function displayDefaultJobs() {
    const defaultJobsData = {
        jobs: [
            {
                name: "pallapu vishnu",
                email: "paliyam@gmail.com",
                designation: "Default Designer",
                jobDescription: "Default Job Description 1",
                experience: "2 years",
                ctc: "4LPA"
            },
            {
                name: "pallapu kusuma",
                email: "paliyam@gmail.com",
                designation: "Default Developer",
                jobDescription: "Default Job Description 2",
                experience: "3 years",
                ctc: "5LPA"
            },
            {
                name: "challa praveena",
                email: "paliyam@gmail.com",
                designation: "Full stack developer",
                jobDescription: "Default Job Description 1",
                experience: "2 years",
                ctc: "4LPA"
            },
            {
                name: "nandu",
                email: "paliyam@gmail.com",
                designation: "python Developer",
                jobDescription: "Default Job Description 2",
                experience: "3 years",
                ctc: "5LPA"
            },
            // Add more default job data as needed
        ]
    };

    // Call the displayJobs function with default data
    displayJobs(defaultJobsData);
}

// Display default jobs when the page loads
window.onload = displayDefaultJobs;

function applyForJob(jobName) {
    // Perform actions when the Apply button is clicked
    console.log(`Applying for job: ${jobName}`);
    // Add your logic here, such as opening a modal or redirecting to an application form.
}
