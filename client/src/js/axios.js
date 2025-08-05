import axiosBase from 'axios';

const axios = axiosBase.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : '/api',
    withCredentials: true
})

export default axios;