import { useEffect } from 'react';

import UserApi from '../../api/UserApi';

import QuizSlide from '../QuizSlide/quizslide.jsx';
import Chatbox from '../Chatbox/Chatbox.jsx';
import '../Home/home.css';

export default function AISearchPage() {
  useEffect(() => {
    const fetchData = async () => {
      const tokenRaw = localStorage.getItem('token');
      const userID = tokenRaw ? JSON.parse(tokenRaw)?.[0]?.userID : null;

      const res = await UserApi.getuserinfo(userID);
      //console.log('User info:', res);
      //console.log(res);
      if (res.dotest === true) {
        window.location.href = '/finishedsurvey';
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className=" w-full h-auto md:h-[86vh] max-w-full md:max-w-[850px] mx-auto px-0 md:px-4">
        <QuizSlide />
      </div>
      {/* Chat Box */}
      <Chatbox />
    </div>
  );
}
