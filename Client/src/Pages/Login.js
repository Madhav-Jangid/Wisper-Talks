import React, { useEffect, useState } from 'react';
import { Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from '@mui/material';
import "../css/Auth.css";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, Navigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';

export default function Login({ isPrivate, changeIsPrivate }) {
  const [showPassword, setShowPassword] = useState(false);
  const [navigateUserToChats, setNavigateUserToChats] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const [formData, setFormData] = useState({
    email: '',
    pass: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isLogined, setIsLogined] = useState(false);



  const handleMouseDownPassword = async (e) => {
    e.preventDefault();
  };

  const LoginUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email, password: formData.pass }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error);
      }

      const result = await response.json();
 
      if (result.type) {
        toast.success('Login Successful 👍');
        localStorage.setItem('IsLogined', true);
        await localStorage.setItem('user', JSON.stringify(result.data._id));
        setIsLogined(result.type ? true : false);
        changeIsPrivate();
        setTimeout(() => {
          setNavigateUserToChats(true)
        }, 3000);
      } else {
        toast.error(result.data);
      }

    } catch (error) {
      console.error('Error during login:', error);
      toast.error(error.message);
    }

    if (isLogined) {
      setTimeout(() => {
        document.querySelector('form').submit();
      }, 5000);
    }
  }



  const [progress, setProgress] = useState(0)

  const loadinBar = () => {
    setProgress(90)
    setTimeout(() => {
      setProgress(100);
    }, 200);
  };

  useEffect(() => {
    if (localStorage.getItem('user')) {
      setNavigateUserToChats(true)
    }else{
      setNavigateUserToChats(false)
    }
  }, [])


  return (
    <div className='authPage'>
      <LoadingBar
        color='var(--primary-text-bark)'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <ToastContainer></ToastContainer>
      {navigateUserToChats ?
        <Navigate to={'/home/chats'}></Navigate> : null
      }
      <div className="authFormCont login">
        <div className="pageInfo">
          <h2>Welcome back!</h2>
          <p>Login to your account to start chatting with friends.</p>

        </div>
        <form className="authForm loginForm">
          <h2>Login here..</h2>
          <TextField className='inputFeild' name='email' onChange={handleInputChange} id="outlined-basic" label="Email" variant="standard" />
          <FormControl className='inputFeild'
            variant="standard" sx={{ m: 1 }}>
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              name='pass'
              onChange={(e) => handleInputChange(e)}
              id="standard-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button className='authButtons' variant="contained" onClick={(e) => {
            e.preventDefault();
            loadinBar();
            LoginUser(e);
          }}>Login</Button>
          <h5><span></span> Or Sign Up <span></span></h5>
          <h4>
            Don't have an account
            <Link className='link' to={'/register'}> Sign Up</Link>
          </h4>
        </form>
      </div>
    </div>
  )
}
