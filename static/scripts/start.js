document.addEventListener('DOMContentLoaded', () => {
  // Handle log in.
  const form = document.querySelector('#start-form');
  const submitButton = document.querySelector('#start-form .submit-button');
  const firstName = document.querySelector('#first-name');
  const surname = document.querySelector('#surname');
  const email = document.querySelector('#email');
  const phone = document.querySelector('#phone');
  const loginError = document.querySelector('.error-list');

  firstName.focus();

  for (const element of document.querySelectorAll('#start-form input')) {
    element.addEventListener('input', event => {
      event.preventDefault();
      if (!element.checkValidity()) {
        element.classList.add('invalid');
      } else {
        element.classList.remove('invalid');
      }
    });
  }

  form.addEventListener('submit', event => {
    let invalid = false;
    clearError();

    if (!firstName.checkValidity()) {
      showError(firstName, getErrorMsg('first name', firstName.validity));
      invalid = true;
    }

    if (!surname.checkValidity()) {
      showError(surname, getErrorMsg('surname', surname.validity));
      invalid = true;
    }

    if (!email.checkValidity()) {
      showError(email, getErrorMsg('email', email.validity));
      invalid = true;
    }

    if (!phone.checkValidity()) {
      showError(phone, getErrorMsg('phone', phone.validity));
      invalid = true;
    }

    if (invalid) {
      event.preventDefault();
    }
  });

  // These functions are in the event handler because they use elements from the DOM.
  function showError(element, text) {
    const item = document.createElement('li');
    item.textContent = text;
    loginError.appendChild(item);

    element.classList.add('invalid');
  }

  function clearError() {
    while (loginError.firstChild) {
      loginError.removeChild(loginError.firstChild);
    }
  }

  function getErrorMsg(name, validity) {
    let message;
    switch (true) {
      case validity.valueMissing:
        message = `${name} cannot be empty.`;
        break;
      case validity.tooLong:
        message = `${name} too long.`;
        break;
      case validity.rangeOverflow:
        message = `${name} too big.`;
        break;
      case validity.rangeUnderflow:
        message = `${name} too small.`;
        break;
      default:
        message = `Invalid ${name}.`;

    return message;
    }

    return sentenceCase(message);
  }

  function sentenceCase(text) {
    return text[0].toUpperCase() + (text.slice(1)).toLowerCase();
  }
});
