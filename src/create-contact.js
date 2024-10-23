import execution from 'k6/execution';
import { loginUser } from './helper/user.js';
import { createContact } from './helper/contact.js';

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 10,
  // A string specifying the total duration of the test run.
  duration: '10s',
};

export function setup() {
    const totalContact = Number(__ENV.TOTAL_CONTACT) || 10;
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            first_name : "Kontak",
            last_name : `Ke-${i}`,
            email : `contact-${i}@example.com`,
        })
    }

    return data;
}

export function getToken(){
    const username = `contoh${execution.vu.idInInstance}`

    const loginRequest = {
        username: username,
        password: 'rahasia',
    }

    const loginResponse = loginUser(loginRequest)

    const loginBodyResponse = loginResponse.json();

    return loginBodyResponse.data.token
}

// tambahkan parameter apapun ke default function agar bisa menerima hasil dari function setup
export default function(data) {
    const token = getToken();

    for (let i = 0; i < data.length; i++) {
        const contact = data[i];
        createContact(token, contact)
    }
}

export function teardown(data){
    console.info(`finish create ${data.length} contacts`)
}
