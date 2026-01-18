import axios from './axiosClient';

const SettingTest = {
  getsetting: () => axios.get('/setting/getsetting'),
};

export default SettingTest;
