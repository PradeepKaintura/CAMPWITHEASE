// Get the form and password input element
const form = document.getElementById('formsubmit');
const passwordInput = document.getElementById('password');

// Add an event listener to the form's submit event
form.addEventListener('submit', function(event) {
    // Check if the password meets the required criteria
    if (!isPasswordValid(passwordInput.value)) {
        // Prevent the form submission
        event.preventDefault();
        // Show the error message
        passwordInput.classList.add('is-invalid');
        passwordInput.nextElementSibling.style.display = 'block';
    }
});

// Function to validate the password
function isPasswordValid(password) {
    // Add your password validation logic here
    // For example, check if the password length is greater than 8,
    // contains a special character, digit, and uppercase letter.
    const regex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}