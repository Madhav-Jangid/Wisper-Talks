/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Home from './Pages/Home';


function App() {

  const [dataOfLoginedUser, setDataOfLoginedUser] = useState({});

  const [isPrivate, setIsPrivate] = useState(false);

  const changeIsPrivate = () => {
    let id = JSON.parse(localStorage.getItem('user'));
    fetchUserInfo(id);
    setIsPrivate(JSON.parse(localStorage.getItem('IsLogined')));
  };

  const fetchUserInfo = async (id) => {
    if (id) {
      try {
        const response = await fetch(`/api/user/${id}`);
        if (!response.ok) {
          return console.error(`Error while fetching user Data`);
        }

        const userInfo = await response.json();
        setDataOfLoginedUser(userInfo.user);

      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    changeIsPrivate();
  }, []);

  return (
    <div className="appMainScreen" style={{
      height: 'calc(100vh - 30px)',
      overflow: 'hidden',
    }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login changeIsPrivate={changeIsPrivate} />} />
          <Route path="/register" element={<Signup />} />
        </Routes>
      {JSON.parse(localStorage.getItem('user')) ?
        <Home changeIsPrivate={changeIsPrivate} isPrivate={isPrivate} dataOfLoginedUser={dataOfLoginedUser}></Home> : null
      }
      </Router>
    </div>
  );
}

export default App;
