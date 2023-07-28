function validateEmail() {
  const emailInput = document.getElementById('email').value;
  const lowerCaseEmail = emailInput.toLowerCase();

  if (emailInput !== lowerCaseEmail) {
    document.getElementById('errormessage').innerHTML =
      'Email must be in lowercase!';
    return false;
  }
  document.getElementById('errormessage').innerHTML = '';
  return true;
}

const submitform = document.getElementById('submitform');
submitform.addEventListener('click', () => {
  validateEmail();
});

// Function to save form data to local storage
const saveFormDataToLocalStorage = (formData) => {
  localStorage.setItem('contactFormData', JSON.stringify(formData));
};

// Function to load form data from local storage
const loadFormDataFromLocalStorage = () => {
  const storedFormData = localStorage.getItem('contactFormData');
  return storedFormData ? JSON.parse(storedFormData) : {};
};

// Function to populate the form with the loaded data
const populateFormWithStoredData = (formData) => {
  document.getElementById('name').value = formData.name || '';
  document.getElementById('email').value = formData.email || '';
  document.getElementById('message').value = formData.message || '';
};

// Event listener for form submission
document.getElementById('contactForm').addEventListener('submit', (event) => {
  event.preventDefault();

  // Gather form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  };

  // Save form data to local storage
  saveFormDataToLocalStorage(formData);
  document.getElementById('successmessage').innerHTML = 'Message sent';

  // Handle form submission (you can send the form data to the server here)
  console.log('Form data submitted:', formData);
});

// On page load, load form data from local storage and populate the form
const storedFormData = loadFormDataFromLocalStorage();
populateFormWithStoredData(storedFormData);
