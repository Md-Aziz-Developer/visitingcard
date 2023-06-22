import axios from 'axios';
import React, { useState } from 'react'
import {Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [number,setNumber]=useState('');
    const [password,setPassword]=useState('');
    const naviagte=useNavigate();
    axios.defaults.withCredentials=true;
    function registerUser(e){
        e.preventDefault();
        axios.post('http://localhost:3003/create',{name,email,number,password})
        .then(res=>{
            if(res.data.Status=='success'){
                naviagte('/');
            }else{
                console.log(res);
            }
            console.log(res);
        })
        .catch(err=>console.log(err))
    }
  return (
   <>
   <div className='container p-5'>
    <div className='row justify-content-center'>
        <div className='col-12 col-md-4 p-3 border rounded mt-5'>
            <h3 className='text-center'>Register Now</h3>
            <form onSubmit={registerUser}>
            <div className='form-group mb-3'>
                <label>Name</label>
                <input type='text' className='form-control' name='name' placeholder='Enter Name' value={name} onChange={(e)=>{setName(e.target.value)}} required/>
            </div>
            <div className='form-group mb-3'>
                <label>Email</label>
                <input type='email' className='form-control' name='email' placeholder='Enter Email' value={email} onChange={e=>{setEmail(e.target.value)}} required/>
            </div>
            <div className='form-group mb-3'>
                <label>Number</label>
                <input type='number' className='form-control' name='number' minLength={10} placeholder='Enter Number' value={number} onChange={e=>{setNumber(e.target.value)}} required/>
            </div>
            <div className='form-group mb-3'>
                <label>Password</label>
                <input type='password' className='form-control' name='password' placeholder='Enter Password' value={password} onChange={e=>{setPassword(e.target.value)}} required/>
            </div>
            <div className='w-100 text-center'>
                <button type='submit'  className='btn btn-sn btn-dark'>Register Now</button><br/>
                <Link to={'/login'}>Login</Link>
            </div>
            </form>
        </div>
    </div>
   </div>
   </>
  )
}
