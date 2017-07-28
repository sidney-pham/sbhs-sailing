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
    document.querySelector('.login-error-text').textContent = '';
    for (const element of document.querySelectorAll('#login-form input')) {
      element.classList.remove('login-error');
      element.value = '';
    }
  });

  // Handle log in.
  const submitButton = document.querySelector('#non-sbhs-login .submit-button');
  const emailBox = document.querySelector('#email');

  emailBox.addEventListener('keypress', event => {
    if (event.key == 'Enter') {
      alert('enter');
    }
  })

  submitButton.addEventListener('click', event => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    submitButton.textContent = 'Logging in...';
    fetch('/login', {
      method: 'POST',
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify({email: email, password: password})
    }).then(res => {
      // Get JSON data from Response object.
      return res.json();
    }).then(data => {
      if (data.logged_in) {
        // Logged in.
        location.reload();
      } else {
        // Wrong email or password.
        console.log(data);
        document.querySelector('.login-error-text').textContent = data.message;
        for (const element of document.querySelectorAll('#login-form input')) {
          element.classList.add('login-error');
        }
        submitButton.textContent = 'Huh?';
        setTimeout(() => {
          submitButton.textContent = 'Log in';
        }, 1000);
      }
    }).catch(data => {
      console.log(data);
    });
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
