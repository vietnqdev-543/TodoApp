
import { useState } from 'react';
import { Routes, Route , useNavigate } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import SignIn from './Components/Auth/SignIn';
import TodoList from "./Components/Todolist/TodoList"
import SignUp from './Components/Auth/SignUp';


const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem('email'));
  const [isHeaderVisible, setIsHeaderVisible] = useState(!!user);

  const handleSignIn = (email) => {
    localStorage.setItem('email', email);
    setUser(email);
    setIsHeaderVisible(true); // Hiển thị header sau khi đăng nhập
  };

  const handleSignOut = () => {
    localStorage.removeItem('email');
    setUser(null);
    setIsHeaderVisible(false); // Ẩn header sau khi đăng xuất
    navigate("/signIn");
  };

  return (
    <div>
      {isHeaderVisible && <Header isLoggedIn={!!user} onSignOut={handleSignOut}   />}
      <Routes>
        <Route path="/" element={user ? <Home onSignOut={handleSignOut}   /> : <SignIn onSignIn={handleSignIn} />} />
        <Route path="/home" element={<Home onSignOut={handleSignOut} />} />
        <Route path="/todolist" element={user ? <TodoList user={user} /> : <SignIn onSignIn={handleSignIn} />} />
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn onSignIn={handleSignIn} />} />
      </Routes>
    </div>
  );
};

export default App;
