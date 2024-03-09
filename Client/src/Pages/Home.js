import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SideBar from '../Components/SideBar';
import LoadingBar from 'react-top-loading-bar';
import AllUsersNav from '../Components/AllUsersNav';
import Conversation from '../Components/Conversation';
import AllNotifications from '../Components/AllNotifications';
import AllGroups from '../Components/AllGroups';
import AllCall from '../Components/AllCall';
import AllSettings from '../Components/AllSettings';

export default function Home({ isPrivate, changeIsPrivate, dataOfLoginedUser }) {

  const [dataState, setDataState] = useState({});
  const [data, setData] = useState({});
  const [activeLink, setActiveLink] = useState('msg');

  const handleClickOnUser = (data) => {
    try {
      setDataState(data);
      
      
    } catch (error) {
      console.error(error);
    }
  };

  const [currentUserData,setCurrentUserData] = useState({})


  const [progress, setProgress] = useState(0)

  const loadinBar = () => {
    setProgress(90)
    setTimeout(() => {
      setProgress(100);
    }, 200);
  };


  useEffect(() => {
    if (dataState) {
      setData(dataState);
    }
  }, [dataState]);
  
  useEffect(()=>{
    setCurrentUserData(dataOfLoginedUser);
  },[dataOfLoginedUser])


  return (
    <div className="MainScreen" style={{ display: 'flex' }}>

      {!isPrivate ? <Navigate to={'/'}></Navigate> : null}

      <div className='MainScreen' style={{ display: 'flex' }}>

        <LoadingBar color='var(--primary-text-bark)' progress={progress} onLoaderFinished={() => setProgress(0)} />

        <SideBar changeIsPrivate={changeIsPrivate} active={activeLink} data={currentUserData} setActiveLink={setActiveLink}/>
        <Routes>

          <Route path="/home/chats"
            element={
              <>
                <AllUsersNav dataOfLoginedUser={currentUserData} loadinBar={loadinBar} handleClickOnUser={handleClickOnUser} heading={'Messages'} />
              </>}>
          </Route>

          <Route path="/home/groups"
            element={
              <>
                {!isPrivate ? <Navigate to={'/'}></Navigate> : null}
                <AllGroups heading={'Groups'} dataOfLoginedUser={currentUserData}></AllGroups>
              </>
            }>
          </Route>

          <Route path="/home/notifications"
            element={
              <>
                {!isPrivate ? <Navigate to={'/'}></Navigate> : null}
                <AllNotifications heading={'Notifications'} dataOfLoginedUser={dataOfLoginedUser}/>
              </>
            }>
          </Route>


          <Route path="/home/calls"
            element={
              <>
                {!isPrivate ? <Navigate to={'/'}></Navigate> : null}
                <AllCall heading={'Calls'} dataOfLoginedUser={dataOfLoginedUser}></AllCall>
              </>
            }>
          </Route>


          <Route path="/home/settings"
            element={
              <>
                {!isPrivate ? <Navigate to={'/'}></Navigate> : null}
                <AllSettings heading={'Settings'} dataOfLoginedUser={dataOfLoginedUser}></AllSettings>
              </>
            }>
          </Route>

        </Routes>
        <Conversation data={data} dataOfLoginedUser={currentUserData} ></Conversation>
      </div>
    </div>

  );
}
