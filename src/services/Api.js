import axios from 'axios';

const api = axios.create({
    baseURL: 'https://simple-search-api.herokuapp.com'
});

export default api;