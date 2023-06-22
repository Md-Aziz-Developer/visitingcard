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
    <div className='container p-5'>
      <div className='row'>
        <div className='col-md-4'>
       <Sidebar/>
        </div>
        <div className='col-md-8 p-5' >
      <h3>Welcome {user.fld_name}</h3>
        </div>
      </div>
    </div>
    </>
  )
}
