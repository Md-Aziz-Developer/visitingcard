import React, {  useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
import Sidebar from '../includes/Sidebar.js';
import '../css/Style.css'
import axios from 'axios';
export default function Visitingcard() {
    axios.defaults.withCredentials=true;
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [number, setNumber]=useState('');
    const [gender, setGender]=useState('');
    const [address, setAddress]=useState('');
    const [designation, setDesignation]=useState('');
    const [aboutYourself,setAbout]=useState('');
    const [company, setCompany]=useState('');
    const [website, setWebsite]=useState('');
    const [comImage,setComImage]=useState('');
    const [userImage,setUserimage]=useState('');
    const [comUImage,setComUImage]=useState('');
    const [userUImage,setUserUimage]=useState('');
    const [backgroundColor,setbackgroundColor]=useState('#000000');
    const [textColor,setTextColor]=useState('#ffffff');
    const [iconColor,setIconColor]=useState('#000000');
    const [rowCount,setrowCount]=useState(0);
    const [socialList,setSociallist]=useState([{platform:'',url:''}]);
    const [weburl,setWeburl]=useState('');
    const socials=['facebook','instagram','linkedin','twitter','github'];
    const [type,setType]=useState('new');
    const [success,setSuccess]=useState('');
    const [error,setError]=useState('');
    const [urlerror,setUrlError]=useState('');
    const [disableButton,setDisableButton]=useState(false);
    const prefix='http://localhost:3000/profile/';
    useEffect(()=>{
        axios.get('http://localhost:3003/getProfile')
        .then(res=>{
          if(res.data.Status==='success'){
            console.log(res.data);
            setType('old');
            var userdata=res.data.user;
            var userSocial = JSON.parse(userdata.fld_vc_user_social_link);
            setName(userdata.fld_vc_user_name);
            setEmail(userdata.fld_vc_user_email);
            setNumber(userdata.fld_vc_user_number);
            setAddress(userdata.fld_vc_user_address);
            setDesignation(userdata.fld_vc_designation);
            setAbout(userdata.fld_vc_user_about);
            setWebsite(userdata.fld_vc_user_website);
            setCompany(userdata.fld_vc_company_name);
            setGender(userdata.fld_vc_user_gender);
            setSociallist(userSocial);
            setrowCount(userSocial.length);
            setComImage("http://localhost:3003/"+userdata.fld_vc_website_logo)
            setUserimage("http://localhost:3003/"+userdata.fld_vc_user_image)
            setWeburl(userdata.fld_vc_url);
            setbackgroundColor(userdata.fld_backgroud_color)
            setTextColor(userdata.fld_text_color)
            setIconColor(userdata.fld_icon_color)
          }else{
            console.log(res.data);
          }
        })
        .catch(err=>console.log(err))
      },[]);

    const setProfileUrl=(e)=>{
        e=e.trim();
        if(e!==''){
            setName(e);
            var url=e.replace(/[&\\#,+()$~%.,|'":;!@^_*?<>{}]/g, '');
            url=url.replace(/ /g,'-');
            url=url.toLowerCase();
            setWeburl(url);
        }
    }
    const handleinputchange=(e, index)=>{
        const {name, value}= e.target;
        const list= [...socialList];
        list[index][name]= value;
        setSociallist(list);
    }
    const addRow=()=>{ 
        var incnum=rowCount+1;
        setSociallist([...socialList, { name:'', url:''}]);
        setrowCount(incnum);
        
      }
    const removeRow=()=>{
        var decnum=rowCount-1;
        const list=[...socialList];
        list.splice(rowCount,1);
        setSociallist(list);
        setrowCount(decnum);
        
    }
    const checkProfileUrl=e=>{
        const value=e.target.value;
        setWeburl(value);
        if(value.length>3){
        axios.post('http://localhost:3003/check/url/',{url:value})
        .then(res=>{
            if(res.data.status==='success'){
                setDisableButton(false);
                setUrlError('');
            }else{
                setUrlError(res.data.message);
                setDisableButton(true);
            }
        })
        .catch(err=>console.log(err))
    }
    }
    const setCompanyImage= event=>{
        if(event.target.files && event.target.files[0]){
            setComUImage(event.target.files[0]);
            setComImage(URL.createObjectURL(event.target.files[0]));
        }
    }
    const setTheUserImage= event=>{
        if(event.target.files && event.target.files[0]){
            setUserUimage(event.target.files[0]);
            setUserimage(URL.createObjectURL(event.target.files[0]));
        }
    }
    const handleFormRequest= e =>{
        e.preventDefault();
      const formdata=new FormData();
      formdata.append('name',name);
      formdata.append('email',email);
      formdata.append('number',number);
      formdata.append('gender',gender);
      formdata.append('address',address);
      formdata.append('designation',designation);
      formdata.append('about',aboutYourself);
      formdata.append('company',company);
      formdata.append('website',website);
      formdata.append('weburl',weburl);
      formdata.append('socialList',JSON.stringify(socialList));
      formdata.append('companyImage',comUImage);
      formdata.append('userImage',userUImage);
      formdata.append('backgroundColor',backgroundColor);
      formdata.append('textColor',textColor);
      formdata.append('iconColor',iconColor);
        axios.post('http://localhost:3003/create/profile',
            formdata)
        .then(res=>{
            if(res.data.Status==='success'){
                setSuccess(res.data.message);
                setTimeout(function(){
                    setSuccess('');
                },3000);
                console.log(res);
            }else{
                setError(res.data.message);
                setTimeout(function(){
                    setError('');
                },3000);
                console.log(res);
            }
            console.log(res);
        })
        .catch(err=>console.log(err))
    };
  return (
    <>
    <div className='container-fluid'>
      <div className='row flex-nowwrap'>
        <div className='col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark'>
       <Sidebar/>
        </div>
        <div className='col py-3' >
      <div className='row'>
        <div className='col-12'>
        <h3 className='text-center '>Create or Edit Visiting Card and Preview the final result</h3>    
        {error!=='' ?
            <h4 className="text-danger text-center">{error}</h4>
            : ''
            }
            {success!=='' ?
            <h4 className="text-success text-center">{success}</h4>
            : ''
            }
        </div>
        <div className='col-md-6 p-3 border-right'>
            <form onSubmit={handleFormRequest} encType="multipart/form-data"> 
            <div className='row'>
                <div className='col-md-6 form-group mb-3'>
                    <label>Name <span className='text-danger'>*</span></label>
                    <input type='text' name='name' className='form-control' placeholder='Name' onChange={(e)=>setProfileUrl(e.target.value)} required value={name}/>
                </div>
                <div className='col-md-6 form-group mb-3'>
                    <label>Email <span className='text-danger'>*</span></label>
                    <input type='email' name='email' className='form-control' placeholder='Email' onChange={(e)=>setEmail(e.target.value)} required value={email}/>
                </div>
                <div className='col-md-12 form-group mb-3'>
                    <label htmlFor="basic-url" className="form-label">Your Profile URL</label>
                    <div className="input-group">
                    <span className="input-group-text" id="basic-addon3">{prefix}</span>
                    <input type="text" className="form-control" id="basic-url" onChange={(e)=>checkProfileUrl(e)} aria-describedby="basic-addon3" value={weburl}/>
                    
                    </div>
                    {urlerror!=='' ?
                        <p className="text-danger text-left p-0 m-0">{urlerror}</p>
                        : ''
                        }
                </div>
                <div className='col-md-6 form-group mb-3'>
                    <label>Number <span className='text-danger'>*</span></label>
                    <input type='number' name='number' className='form-control' placeholder='Number' onChange={(e)=>setNumber(e.target.value)} required value={number}/>
                </div>
                <div className='col-md-6 form-group mb-3'>
                    <label>Gender </label>
                    <select className='form-control' name='gender' onChange={(e)=>setGender(e.target.value)} value={gender}>
                        <option value=''>Select Gender</option>
                        <option value='male' >Male</option>
                        <option value='female'>female</option>
                        <option value='other'>Other</option>

                    </select>
                </div>
                <div className='col-md-12 form-group mb-3'>
                    <label>Address <span className='text-danger'>*</span></label>
                    <input type='text' name='address' className='form-control' placeholder='Address' onChange={(e)=>setAddress(e.target.value)} required value={address}/>
                </div>
                <div className='col-md-6 form-group mb-3'>
                    <label>Company Name <span className='text-danger'>*</span></label>
                    <input type='text' name='companyName' className='form-control' placeholder='Company Name' onChange={(e)=>setCompany(e.target.value)} required value={company}/>
                </div>
                
                <div className='col-md-6 form-group mb-3'>
                    <label>Your Designation <span className='text-danger'>*</span></label>
                    <input type='text' name='designation' className='form-control' placeholder='Designation' onChange={(e)=>setDesignation(e.target.value)} required value={designation}/>
                </div>
                <div className='col-md-12 form-group mb-3'>
                    <label>About Yourself  <span className='text-danger'>*</span></label>
                    <textarea className='form-control' name='aboutYourself' value={aboutYourself} placeholder='About Yourself' maxLength={300} onChange={(e)=>{
                        setAbout(e.target.value)
                    }}></textarea>
                </div>
                <div className='col-md-6 form-group mb-3'>
                    <label>Company Logo <span className='text-danger'>*</span></label>
                    <input type='file' name='companyLogo' className='form-control' onChange={setCompanyImage} />
                </div>
                <div className='col-md-6 form-group mb-3'>
                    <label>Your Image <span className='text-danger'>*</span></label>
                    <input type='file' name='image' className='form-control'   onChange={setTheUserImage} />
                </div>
                <div className='col-md-4 form-group mb-3'>
                    <label>Background Color <span className='text-danger'>*</span></label>
                    <input type='color' name='backgroudColor' className='form-control' onChange={(e)=>setbackgroundColor(e.target.value)} required value={backgroundColor}/>
                </div>
                <div className='col-md-4 form-group mb-3'>
                    <label>Text Color <span className='text-danger'>*</span></label>
                    <input type='color' name='textColor' className='form-control' onChange={(e)=>setTextColor(e.target.value)} required value={textColor}/>
                </div>
                <div className='col-md-4 form-group mb-3'>
                    <label>Icon Color <span className='text-danger'>*</span></label>
                    <input type='color' name='iconColor' className='form-control' onChange={(e)=>setIconColor(e.target.value)} required value={iconColor}/>
                </div>
                <div className='col-md-12 form-group mb-3'>
                    <label>Website </label>
                    <input type='text' name='website' className='form-control' placeholder='Website' onChange={(e)=>setWebsite(e.target.value)} value={website}/>
                </div>
                <div className='col-md-12 d-flex'>
                    <div className='w-50 text-left'>
                        <h4>Social Links</h4>
                    </div>
                    <div className='w-50 text-right'>
                        <Link className='btn btn-outline-success btn-sm' onClick={addRow}>+ Add</Link>&nbsp;
                        {
                            !rowCount <1 ?
                        <Link  className='btn btn-outline-danger btn-sm' onClick={removeRow}>- Remove</Link>
                        : ''
                        }
                    </div>
                </div>
                <div className='col-md-12' id='socialLinks'>
                    {
                        socialList.map((x,i)=>{
                            return(
                                <div className='row' id={"socialLink"+i} key={i}>
                                <div className='col-4 form-group mb-2'>
                                <label>Platform <span className='text-danger'>*</span></label>
                                <select className='form-control' name='platform' onChange={ e=>handleinputchange(e,i)} required value={socialList[i]['platform']}>
                                    <option value=''>Select Platform</option>
                                    {
                                        socials.map((x,j)=>{
                                            return (<option value={socials[j]} >{socials[j]}</option>);
                                        })
                                    }
                                </select>
                                </div>
                                <div className='col-8 form-group mb-2'>
                                    <label>Url <span className='text-danger'>*</span></label>
                                    <input type='url' name='url' className='form-control' placeholder='Url' onChange={ e=>handleinputchange(e,i)} required value={socialList[i]['url']}/>
                                </div>
                                </div>
                            );
                        })
                    }
                    
                </div>
                <div className='text-center w-100 '>
                    <button type='submit' className='btn btn-dark' disabled={disableButton}>{type==='new' ? 'Create' : "Update"} Profile</button>
                </div>
            </div>
            </form>
        </div>
        <div className='offset-md-1 col-md-4 p-3'>
            {
                weburl!==''?
                <Link to={prefix+weburl} className='text-center' target='_blank'>{prefix+weburl}</Link>
                : ''
            }
            <div className='row p-3 text-white rounded ' style={{backgroundColor:backgroundColor}}>
                <div className='col-md-12 '>
                { comImage!=='' ?
                    <img src={comImage} width={120} height='auto' className='m-3' alt={company}/>
                    :''
                }
                </div>
                <div className='col-md-12 text-center'>
                    { userImage!=='' ?
                    <img src={userImage} width={60} height={60} className='rounded-circle' alt={name}/>
                        :''
                    }
                    <h4 style={{color:textColor}}>{name}</h4>
                    {designation !=='' ?
                    <hr style={{width:'100px',height:'3px', color:'#efefef', margin:'0 auto'}}/>
                    :''
                    }
                    <h4 style={{color:textColor}}>{designation}</h4>
                    {
                        aboutYourself!=='' ?
                        <hr style={{width:'100px',height:'3px', color:'#efefef', margin:'0 auto'}}/>
                        : ''
                    }
                    <p style={{color:textColor,textAlign:'justify'}}>{aboutYourself}</p>
                </div>
                <div className='col-11 pl-3'>
                    { number!=='' ?
                    <p className='information' style={{color:textColor}}><i className="fa-solid fa-phone" style={{color:iconColor}}></i>&nbsp; <span >+91 {number}</span></p>
                    : '' }
                    {email!=='' ?
                    <p className='information' style={{color:textColor}}><i className="fa-solid fa-envelope" style={{color:iconColor}}></i>&nbsp;&nbsp; <span > {email}</span></p>
                    : '' }
                    { website!=='' ?
                    <p className='information' style={{color:textColor}}><i className="fa-solid fa-globe" style={{color:iconColor}}></i>&nbsp;&nbsp; <span >{website}</span></p>
                    : '' }
                    { address!=='' ?
                    <p className='information' style={{color:textColor}}><i className="fa-solid fa-location-dot" style={{color:iconColor}}></i>&nbsp;&nbsp; <span >{address}</span></p>
                    : '' }
                    
                </div>
                <div className='col-1 mt-3 pr-3 d-block'>
                    {
                        socialList.map((i)=>{
                            return (
                                <><Link  style={{color:iconColor}} className='fs-4 ' to={i['url']} key={i} target='_blank'><i  className={'fa-brands fa-'+i['platform']}></i></Link><br /></>  
                            );
                    })
                }
                </div>
            </div>
        </div>
      </div>
        </div>
      </div>
    </div>
    </>
  )
}
