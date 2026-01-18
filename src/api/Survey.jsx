import axios from '../api/axiosClient';

const survey = {
  getsurvey: () => {
    return axios.get('/survey/allsurveys');
  },
  submitsurvey: (data) => {
    return axios.post('/survey/submitsurvey', data);
  },
};

export default survey;
