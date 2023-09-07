import "./home.scss"
import moment from 'moment'

moment.locale('vi'); // Đặt locale tiếng Việt ở đây

const Home = () => {

  const day = moment().format('dddd'); 
  const days = moment().format('LL');
  const oclock = moment().format('LT'); 

  const userEmail = localStorage.getItem('email');
  const userName = userEmail ? userEmail.split('@')[0] : '';

  return (
    <div className='home-container'>
      <h1 className="home-title">Welcome to WORKLIST</h1>
      <h1>Hello, {userName}</h1>
      <h5> Hôm nay là: {day}, {days}</h5>
      <h5> Bây giờ đang là: {oclock}</h5>
    </div>
  );
}

export default Home;
