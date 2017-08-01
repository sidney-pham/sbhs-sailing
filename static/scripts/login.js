document.addEventListener('DOMContentLoaded', () => {
  // Handle different login methods.
  const sbhsLogin = document.querySelector('#sbhs-login');
  const nonSbhsButton = document.querySelector('#non-sbhs-button');
  const nonSbhsLogin = document.querySelector('#non-sbhs-login');
  const nonSbhsBack = document.querySelector('#non-sbhs-login-back');

  nonSbhsLogin.style.display = 'none';

  nonSbhsButton.addEventListener('click', event => {
    nonSbhsLogin.style.display = '';
    sbhsLogin.style.display = 'none';
    document.querySelector('#email').focus();
  });

  nonSbhsBack.addEventListener('click', event => {
    nonSbhsLogin.style.display = 'none';
    sbhsLogin.style.display = '';
    // Reset non-SBHS login.
    clearError();
    for (const element of document.querySelectorAll('#login-form input')) {
      element.value = '';
    }
  });

  // Handle log in.
  const form = document.querySelector('#login-form');
  const submitButton = document.querySelector('#non-sbhs-login .submit-button');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const loginError = document.querySelector('.login-error-text');

    if (!email.checkValidity()) {
      showError(getErrorMsg('email', email.validity));
    } else if (!password.checkValidity()) {
      showError(getErrorMsg('password', password.validity));
    } else {
      clearError();
      submitButton.textContent = 'Logging in...';

      fetch('/login', {
        method: 'POST',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify({email: email.value, password: password.value})
      }).then(res => {
        // Get JSON data from Response object.
        return res.json();
      }).then(data => {
        if (data.logged_in) {
          // Logged in.
          location.reload();
        } else {
          // Wrong email or password.
          showError(data.message);

          // Show 'Huh?' for a second.
          submitButton.textContent = 'Huh?';
          setTimeout(() => {
            submitButton.textContent = 'Log in';
          }, 1000);
        }
      }).catch(data => {
        console.log(data);
      });
    }
  });
});

// function fetch(url, data) {
//   return new Promise((resolve, reject) => {
//     let req = new XMLHttpRequest();
//     req.open(data.method, url);
//     req.setRequestHeader('Content-Type', 'application/json');
//     req.onload = () => {
//       if (this.status == 200) {
//         resolve(this.response);
//       } else {
//         reject(this.response);
//       }
//     };
//     req.send(data.body);
//   });
// }


function showError(text) {
  document.querySelector('.login-error-text').textContent = text;
  for (const element of document.querySelectorAll('#login-form input')) {
    element.classList.add('invalid');
  }
}

function clearError() {
  document.querySelector('.login-error-text').textContent = '';
  for (const element of document.querySelectorAll('#login-form input')) {
    element.classList.remove('invalid');
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
