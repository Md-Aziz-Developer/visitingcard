import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';
export default function Sidebar() {
    const naviagte=useNavigate();
    function logoutUser()
  {
    axios.get('http://localhost:3003/logout')
    .then(res=>{
      console.log(res.data)
      naviagte('/login');
    })
    .catch(err=>console.log(err))
  }
  return (
   <>
    <ListGroup as="ul">
      <ListGroup.Item as="li" active>
        <Link to={'/profile'} className='text-white text-decoration-none fs-4 fw-bold'>Profile</Link>
      </ListGroup.Item>
      <ListGroup.Item as="li" className='text-decoration-none fs-5 fw-bold'><Link to={'/card'} className='text-decoration-none fs-4 fw-bold'>Visiting Card</Link></ListGroup.Item>
      <ListGroup.Item as="li" ><Link onClick={logoutUser} className='text-danger text-decoration-none fs-5 fw-bold'>Logout</Link></ListGroup.Item>
    </ListGroup>
   </>
  )
}
