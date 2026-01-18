import axios from './axiosClient';

const GroqApi = {
  getResponse: (message) => {
    return axios.post('/Groq/chat', message);
  },
  Isaskingaboutanswerasync: (message) => {
    return axios.post('/Groq/isaskingaboutanswerasync', message);
  },
};

export default GroqApi;
