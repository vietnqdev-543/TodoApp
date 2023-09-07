

import { Link } from 'react-router-dom';
import "./Header.scss"
const Header = ({ isLoggedIn, onSignOut }) => {
  const userEmail = localStorage.getItem('email');
  const userName = userEmail ? userEmail.split('@')[0] : '';

  // const [showLogoutButton, setShowLogoutButton] = useState(false);
  const handleLogOut = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.clear();
    onSignOut(); // Gọi hàm onSignOut để thực hiện việc đăng xuất
  };
  return (
    <div>
      {isLoggedIn && ( // Ẩn header khi chưa đăng nhập
        <ul className='header'>

          <div className="header-item">
            <li className='header-item-logo'>LOGO</li>
            <li className='header-item-nav'><Link to="/home">Home</Link></li>
            <li className='header-item-nav'><Link to="/todolist">TodoList</Link></li>
          </div>

          <div className="header-item header-user">
            <span className='header-user-avt'></span>
            <div className='header-user-name'>
              {/* {userName}*/}
              {userName.length <= 7 ? (
                userName
              ) : (
                `${userName.substring(0, 9)}...`
              )}
            </div>

            {/* Hiển thị nút đăng xuất khi hover */}
            <div className='header-user-logout'>
              <button className="header-btn-logout" onClick={handleLogOut}> Đăng xuất <i style={{ marginLeft: 5 }} className="bi bi-box-arrow-right"></i></button>
            </div>
          </div>

        </ul>
      )}
    </div>
  );
};

export default Header;
