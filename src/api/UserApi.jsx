import axios from './axiosClient';

const UserApi = {
  checkLogin: (username, password) =>
    axios.post('/user/checklogin', {
      username: username,
      password: password,
    }),
  submitTest: (data) => axios.post('/user/submittest', data),
  getuserinfo: (id) => {
    return axios.post(`/user/getuser/${id}`);
  },
  registeracc: (data) => {
    return axios.post('/user/register', data);
  },
  edituser: (data) => {
    return axios.put('/user/edituser', data);
  },
  sendmail: (userid) => {
    return axios.post(`/user/sendemail/${userid}`);
  },
};

export default UserApi;
