import  { useState } from 'react';
import { createUserWithEmailAndPassword   , AuthErrorCodes} from 'firebase/auth';
import { auth } from './Config';
import { useNavigate , Link } from 'react-router-dom';
import './SignUp.scss'
import { ToastContainer, toast } from 'react-toastify'; // thư viện thông báo react
import 'react-toastify/dist/ReactToastify.css';



const SignUp = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
                                                   
      if (!email.includes('@gmail.com' || email.includes(''))) {
        toast.error('Sai định dạng email');
        return;
      }

      if (password.length < 6 || password.includes(' ')) {
        toast.error('Mật khẩu phải có ít nhất 6 ký tự và không chứa khoảng trắng');
        return;
      }

    createUserWithEmailAndPassword(auth, email, password) 
      .then((userCredential) => { 
        const user = userCredential.user; 
        const userEmail = user.email; 
        localStorage.setItem('email', userEmail); 
        toast.success('Đăng Kí Thành Công');
        setTimeout(() => {
          navigate('/signIn');
        },2000)
    
      })
      .catch((error) => {
        console.error('Đã có lỗi xảy ra:', error);
        if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
          toast.error('Tài khoản đã tồn tại');
        } else {
          toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      });
  };

  return (
    <div className='signUp-container'>
        <h2 className='signUp-title'>Đăng ký</h2>
        <div>
          <input className='signUp-input' placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <input className='signUp-input' placeholder='Mật khẩu' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className='signUp-btn-submit' onClick={handleSignUp}>Sign Up</button>
        <div className="signIn-navlink">
          <span>Bạn đã có tài khoản ?</span>
           <li><Link to="/signIn" style={{color:'blue' , textDecoration : 'none' , paddingLeft : 7}}>Đăng nhập</Link></li>
        </div>
        <ToastContainer autoClose={1000} /> {/* Thành phần để hiển thị thông báo */}
      </div>
  );
};

export default SignUp;
