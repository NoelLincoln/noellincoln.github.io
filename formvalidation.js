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
