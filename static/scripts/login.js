document.addEventListener('DOMContentLoaded', function() {
  const sbhsLogin = document.querySelector('#sbhs-login');
  const nonSbhsButton = document.querySelector('#non-sbhs-button');
  const nonSbhsLogin = document.querySelector('#non-sbhs-login');
  const nonSbhsBack = document.querySelector('#non-sbhs-login-back');

  nonSbhsLogin.style.display = 'none';

  nonSbhsButton.addEventListener('click', function(event) {
    nonSbhsLogin.style.display = '';
    sbhsLogin.style.display = 'none';
  });

  nonSbhsBack.addEventListener('click', function(event) {
    nonSbhsLogin.style.display = 'none';
    sbhsLogin.style.display = '';
  });
});
