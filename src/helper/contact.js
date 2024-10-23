import { check } from 'k6';
import http from 'k6/http';

export function createContact(token, contact){
    const response = http.post('http://localhost:3000/api/contacts', JSON.stringify(contact), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
        },
    });
    check(response, {
        'create contact status is 200': (r) => r.status === 200,
    });

    return response;
}