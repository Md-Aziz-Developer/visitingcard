import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [errmessage,setErrMessage]=useState('');
    const naviagte=useNavigate();
    axios.defaults.withCredentials=true;
    function loginUser(e){
        e.preventDefault();
        axios.post('http://localhost:3003/login',{email,password})
        .then(res=>{
            
            
            if(res.data.Status=='success'){
                naviagte('/');
            }else{
                console.log(res);
               if(res.data.Status=='failed'){
                setErrMessage(res.data.message);
               }
            }
        })
        .catch(err=>console.log(err))
    }
  return (
    <>
   <div className='container p-5'>
    <div className='row justify-content-center'>
        <div className='col-12 col-md-4 p-3 border rounded mt-5'>
            <h3 className='text-center'>Login Now</h3>
            {errmessage!='' ?
            <h4 className="text-danger text-center">{errmessage}</h4>
            : ''
            }
            <form onSubmit={loginUser}>
            
            <div className='form-group mb-3'>
                <label>Email</label>
                <input type='email' className='form-control' name='email' placeholder='Enter Email' value={email} onChange={e=>{setEmail(e.target.value)}} required/>
            </div>
            
            <div className='form-group mb-3'>
                <label>Password</label>
                <input type='password' className='form-control' name='password' placeholder='Enter Password' value={password} onChange={e=>{setPassword(e.target.value)}} required/>
            </div>
            <div className='w-100 text-center'>
                <button type='submit'  className='btn btn-sn btn-dark'>Login Now</button><br/>
                <Link to={'/register'}>Register</Link>
            </div>
            </form>
        </div>
    </div>
   </div>
   </>
  )
}
