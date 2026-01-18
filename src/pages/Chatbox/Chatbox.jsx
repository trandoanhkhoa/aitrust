import LaptopUI from '../Chatbox/LaptopUI.jsx';
import MobileUI from '../Chatbox/MobileUI.jsx';
export default function chatbox() {
  const isMobile = window.innerWidth <= 768;
  return <>{isMobile ? <MobileUI /> : <LaptopUI />}</>;
}
