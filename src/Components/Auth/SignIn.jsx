import { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider ,} from "./Config";
import { useNavigate , Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import "./SingIn.scss"


const SignIn = ({ onSignIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider) 
      .then((data) => { 
        const userEmail = data.user.email; 
        const userName = data.user.displayName; 
        localStorage.setItem('email', userEmail);
        localStorage.setItem('name', userName);
        onSignIn(userEmail); // Cập nhật trạng thái đã đăng nhập
        toast.success('Đăng nhập bằng tài khoản google thành công')
        setTimeout(()=> {
          navigate('/home'); 
        },1000)
      })
      .catch(error => {
        console.error("Đã có lỗi xảy ra:", error);
      });
  };


  const handleEmailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => { //  
        const user = userCredential.user; 
        const userEmail = user.email; 
        localStorage.setItem('email', userEmail);
        onSignIn(userEmail); 
        toast.success('Đăng nhập thành công')
        setTimeout(()=> {
          navigate('/home'); 
        },1000)
      })
      .catch(error => {
        console.error("Đã có lỗi xảy ra:", error);
        toast.error('Tài khoản hoặc mật khẩu không chính xác')
      });
  };


  return (
    <div className="signIn-container">
      <div className="signIn-form">
        <h3>Welcome TodoApp</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero perspiciatis consequatur veniam laudantium alias? Dicta porro asperiores corporis dignissimos itaque?</p>
      </div>
      <div className="signIn-form">
        <h3 className="signIn-title" style={{ textAlign: 'center', paddingBottom: 10 }}>Đăng nhập</h3>
        <div className="signIn-item">
          <input className="signIn-input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="signIn-item">
          <input className="signIn-input" placeholder="Mật khẩu " type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="signIn-btn-submit " onClick={handleEmailSignIn}>Đăng nhập</button>
        <div className="signIn-navlink">
          <span>Bạn chưa có tài khoản ?</span>
          <li><Link to="/signUp" style={{ color: 'red', textDecoration: 'none', paddingLeft: 7 }}>Đăng ký</Link></li>
        </div>
        <div className="divider">
          <span className="text"> Hoặc </span>
        </div> 
          <button className="signIn-btn-link " onClick={handleGoogleSignIn}> 
            <i className="bi bi-browser-chrome"></i> 
            Sign In with Google
          </button> 

      <ToastContainer className={ToastContainer} autoClose={1000} /> {/* Thành phần để hiển thị thông báo */}
      </div>


    </div>
  );
}

export default SignIn;
