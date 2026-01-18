import axios from './axiosClient';

const ManagerApi = {
  getscores: (data) => {
    return axios.post('/manager/scores', data);
  },
  getscoredetail: (userid) => {
    return axios.post(`/manager/answerdetails/${userid}`);
  },
  getconversationdetail: (userid, questionid) => {
    return axios.post(`/manager/userconservations/${userid}/${questionid}`);
  },
  getsurveydetail: (userid) => {
    return axios.get(`/manager/getsurveybyiduser/${userid}`);
  },
  getreportrate: (data) => {
    return axios.post(`/manager/reportrate`, data);
  },
  getreportsurvey: (data) => {
    return axios.post('/manager/getreportsurvey', data);
  },
  getallusers: (page, pageSize) => {
    return axios.get(`/manager/getallusers`, {
      params: {
        page,
        pageSize,
      },
    });
  },
  getallquestions: () => {
    return axios.get('/manager/getallquestions');
  },
  getquestionbyid: (id) => {
    return axios.get(`/manager/getquestionbyid/${id}`);
  },
  editquestion: (data) => {
    return axios.post('/manager/editquestion', data);
  },
  addquestion: (data) => {
    return axios.post('/manager/addnewquestion', data);
  },
  getsetting: () => {
    return axios.get('/manager/getsetting');
  },
  editsetting: (time, shufflequestion, timelimit) => {
    return axios.post('/manager/updatesetting', {
      Time: time,
      shuffleQuestion: shufflequestion,
      timeLimit: timelimit,
    });
  },
  edituser: (data) => {
    return axios.put('/manager/edituser', data);
  },
  adduser: (data) => {
    return axios.post('/manager/adduser', data);
  },
  exportExcel: (data) => {
    return axios.post('/manager/export-users-excel', data, {
      responseType: 'blob',
    });
  },
};

export default ManagerApi;
