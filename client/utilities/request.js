export default async function queryAPI(query, variables, operationName) {
  const response = await fetch('/graphql', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables,
      operationName
    })
  });

  if (response.redirected) {
    // GraphQL endpoint requires authentication so if we're not logged in,
    // it redirects us to login.
    window.alert('Session expired. Please log in again.');
    window.location.href = response.url;
  } else {
    // All good!
    return response.json();
  }
}
