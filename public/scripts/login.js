document.addEventListener('DOMContentLoaded', function() {
  const sbhsButton = document.querySelector('.login-container > .sbhs-button');
  const nonSbhsButton = document.querySelector('#non-sbhs-button');
  const nonSbhsLogin = document.querySelector('#non-sbhs-login');
  const nonSbhsBack = document.querySelector('#non-sbhs-login-back');

  nonSbhsLogin.style.display = 'none';

  nonSbhsButton.addEventListener('click', function(event) {
    nonSbhsLogin.style.display = '';
    sbhsButton.style.display = 'none';
    nonSbhsButton.style.display = 'none';
  });

  nonSbhsBack.addEventListener('click', function(event) {
    nonSbhsLogin.style.display = 'none';
    sbhsButton.style.display = '';
    nonSbhsButton.style.display = '';
  });
});