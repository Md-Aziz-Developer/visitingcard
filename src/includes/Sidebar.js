import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Sidebar() {
    const naviagte=useNavigate();
    function logoutUser()
  {
    axios.get('http://localhost:3003/logout')
    .then(res=>{
    //  console.log(res.data)
      naviagte('/login');
    })
    .catch(err=>console.log(err))
  }
  return (
   <>
    {/* <ListGroup as="ul">
      <ListGroup.Item as="li" active>
        <Link to={'/profile'} classNameName='text-white text-decoration-none fs-4 fw-bold'>Profile</Link>
      </ListGroup.Item>
      <ListGroup.Item as="li" classNameName='text-decoration-none fs-5 fw-bold'><Link to={'/card'} classNameName='text-decoration-none fs-4 fw-bold'>Visiting Card</Link></ListGroup.Item>
      <ListGroup.Item as="li" ><Link onClick={logoutUser} classNameName='text-danger text-decoration-none fs-5 fw-bold'>Logout</Link></ListGroup.Item>
    </ListGroup> */}
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <Link to={'/'} className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Dashboard</span>
                </Link>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                <li className="nav-item active">
                        <Link to={'/profile'} className="nav-link align-middle px-0">
                            <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Profile</span>
                        </Link>
                    </li>
                    <li className="nav-item active">
                        <Link to={'/card'} className="nav-link align-middle px-0">
                            <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Visiting Card</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link onClick={logoutUser} className="nav-link px-0 align-middle">
                            <i className="fs-4 bi-table"></i> <span className="ms-1 d-none d-sm-inline">Logout</span></Link>
                    </li>
                   
                </ul>
                
            </div>
       
   </>
  )
}
