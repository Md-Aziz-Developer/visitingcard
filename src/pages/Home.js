import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../includes/Sidebar.js';

export default function Home() {
  const [user,setUser]=useState([]);
  const naviagte=useNavigate();
  axios.defaults.withCredentials=true;
  useEffect(()=>{
    axios.get('http://localhost:3003')
    .then(res=>{
      if(res.data.Status==='success'){
        setUser(res.data.user);
      }else{
        naviagte('/login');
      }
    })
    .catch(err=>console.log(err))
  },[]);
  
  return (
    <>
    <div className='container-fluid'>
      <div className='row flex-nowwrap'>
        <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark'>
       <Sidebar/>
        </div>
        <div className='col py-3' >
      <h3>Welcome {user.fld_name}</h3>
        </div>
      </div>
    </div>
    </>
  )
}
