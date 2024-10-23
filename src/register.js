import { check, fail } from 'k6';
// import http from 'k6/http';
import { getUser, loginUser, registerUser } from './helper/user.js';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '10s',
};

export default function() {
  const uniqueId = new Date().getTime();
  const body = {
    username: `user-${uniqueId}`,
    password: 'password',
    name: `name-${uniqueId}`,
  };

  const checkRegister = registerUser(body);

  if (!checkRegister) {
    fail(`Failed to register user-${uniqueId}`);
  }

  const loginBody = {
    username: `user-${uniqueId}`,
    password: 'password',
  }

  const checkLogin = loginUser(loginBody);

  if (!checkLogin) {
    fail(`Failed to login user-${uniqueId}`);
  }

  const loginBodyResponse = checkLogin.json();

  const checkCurrent = getUser(loginBodyResponse.data.token);

  if(!checkCurrent) {
    fail(`Failed to get user-${uniqueId}`);
  }
}
