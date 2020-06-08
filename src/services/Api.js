import axios from 'axios';

const api = axios.create({
    baseURL: 'https://bcc-tcc.herokuapp.com'
});

export default api;