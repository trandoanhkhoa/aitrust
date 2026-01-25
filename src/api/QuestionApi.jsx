import axios from './axiosClient';

const Question = {
  getQuestions: () => axios.get('/question/getquestions'),
  getquestionanswerbyid: (idquestion) => {
    return axios.get(`/question/getanswersbyid/${idquestion}`);
  },
};

export default Question;
