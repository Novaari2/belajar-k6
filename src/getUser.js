import { check, fail } from 'k6';
import http from 'k6/http';
import execution from 'k6/execution';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '10s',
};

export default function() {
  const username = `contoh${execution.vu.idInInstance}`

  const loginRequest = {
    username: username,
    password: 'rahasia',
  }

  const loginResponse = http.post('http://localhost:3000/api/users/login', JSON.stringify(loginRequest), {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const checkLogin = check(loginResponse, {
    'login response status must 200': (r) => r.status === 200,
    'login response token must exist': (r) => r.json().data.token !== null,
  });

  if (!checkLogin) {
    fail(`Failed to login ${username}`);
  }

  const loginBodyResponse = loginResponse.json();

  const currentResponse = http.get('http://localhost:3000/api/users/current', {
    headers: {
      'Accept': 'application/json',
      'Authorization': loginBodyResponse.data.token,
    }
  });

//   const currentBody = currentResponse.json();
  const checkCurrent = check(currentResponse, {
    'current response status must 200': (r) => r.status === 200,
    'current response data must not null': (r) => r.json().data !== null,
  });

  if(!checkCurrent) {
    fail(`Failed to get ${username}`);
  }
}
