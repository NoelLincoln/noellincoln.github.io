function validateEmail() {
  const emailInput = document.getElementById('email').value;
  const lowerCaseEmail = emailInput.toLowerCase();

  if (emailInput !== lowerCaseEmail) {
    document.getElementById('errormessage').innerHTML = 'Email must be in lowercase!';
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


