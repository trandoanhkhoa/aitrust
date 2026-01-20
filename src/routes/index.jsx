import Home from '../pages/Home/index';
import Login from '../pages/Login/index';
import UserRegister from '../pages/UserRegister/index';
import EditUser from '../pages/UserInfo/edituser';
import Ending from '../pages/Ending/index';
import RegisterSuccess from '../pages/Ending/registersuccess';
import Finishedsurvey from '../pages/Ending/finishedsurvey';
import Survey from '../pages/Survey/index';
import UserInfo from '../pages/UserInfo/index';
import Instruction from '../pages/UserInfo/instructions';
import Dashboard from '../pages/Manager/Dashboard';
import ManageUser from '../pages/Manager/Users';
import SettingTest from '../pages/Manager/Setting';
import Question from '../pages/Manager/Question';
import AddQuestion from '../pages/Manager/Question/addquestion';
import LayoutAdmin from '../components/DefaultLayoutAdmin/';
import MaintenancePage from '../pages/MaintenancePage';

export const publicRoutes = [
  { path: '/login', component: Login, layout: null },
  { path: '/userregister', component: UserRegister, layout: null },
  { path: '/registersuccess', component: RegisterSuccess, layout: null },
  { path: '/Finishedsurvey', component: Finishedsurvey, layout: null },
  //   { path: '/Dashboard', component: Dashboard },
  //   { path: '/course', component: CoursePage },
  //   { path: '/detailcourse', component: DetailCourse },
  //   { path: '/login', component: LoginPage, layout: null },

  //   { path: '/register', component: RegisterPage, layout: null },

  //   { path: '/books', component: Book, layout: null },
];
//Routes need to login for accessing
export const privateRoutes = [
  { path: '/', component: Home },
  { path: '/userinfo', component: UserInfo, layout: null },
  { path: '/instructions', component: Instruction, layout: null },
  { path: '/survey', component: Survey, layout: null },
  { path: '/ending', component: Ending, layout: null },
  { path: '/userregister', component: UserRegister, layout: null },
  { path: '/edituser', component: EditUser, layout: null },
  { path: '/dashboard', component: Dashboard, layout: LayoutAdmin },
  { path: '/settingtest', component: SettingTest, layout: LayoutAdmin },
  { path: '/question', component: Question, layout: LayoutAdmin },
  { path: '/addquestion', component: AddQuestion, layout: LayoutAdmin },
  { path: '/addquestion/edit/:id', component: AddQuestion, layout: LayoutAdmin },
  { path: '/manageuser', component: ManageUser, layout: LayoutAdmin },
];
