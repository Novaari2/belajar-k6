import { createContact } from './helper/contact.js';
import { loginUser, registerUser } from './helper/user.js';
import exec from 'k6/execution';
import { Counter } from 'k6/metrics';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    // treshold
    thresholds: {
        user_registration_success: ['count > 190'],
        user_registration_failed: ['count < 10'],
    },
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "shared-iterations",
            vus: 10,
            iterations: 10,
            maxDuration: '10s',
        },
        contactCreation: {
            exec: "contactCreation",
            executor: "constant-vus",
            vus: 10,
            duration: '10s',
        }
    }
}
// custom metric
const registerCounterSuccess = new Counter("user_registration_success");
const registerCounterFailed = new Counter("user_registration_failed"); 
// end custom metric

export function userRegistration() {
    const uniqueId = uuidv4(); // menggunakan k6-utils remote library
    const registerRequest = {
        username: `user-${uniqueId}`,
        password: 'rahasia',
        name: 'Programmer Keren',
    }

    const response = registerUser(registerRequest)

    // implementasi custom metric
    if (response.status === 200) {
        registerCounterSuccess.add(1)
    } else {
        registerCounterFailed.add(1)
    }
}

export function contactCreation() {
    const number = (exec.vu.idInInstance % 9) + 1 // memaksa hanya user 1-10, karena virtual user ditotal jadi bisa jadi yg dicek id user belasan
    const username = `contoh${number}`
    const loginRequest = {
        username: username,
        password: 'rahasia',
    }

    const loginResponse = loginUser(loginRequest)
    const token = loginResponse.json().data.token

    const contact = {
        "first_name" : "Kontak",
        "last_name" : `Contoh`,
        "email" : `contact@example.com`,
    }

    createContact(token, contact)
}