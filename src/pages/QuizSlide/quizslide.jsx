import LaptopUI from '../QuizSlide/LaptopUI.jsx';
import MobileUI from '../QuizSlide/MobileUI.jsx';

export default function QuizSlide() {
  const isMobile = window.innerWidth <= 768;
  return isMobile ? <MobileUI /> : <LaptopUI />;
}
