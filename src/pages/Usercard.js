import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import '../css/Style.css'
import { Helmet } from 'react-helmet';
import { saveAs } from 'file-saver'
export default function Usercard() {
 
    const urldata=useParams();
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [number, setNumber]=useState('');
    const [address, setAddress]=useState('');
    const [designation, setDesignation]=useState('');
    const [aboutYourself,setAbout]=useState('');
    const [company, setCompany]=useState('');
    const [website, setWebsite]=useState('');
    const [comImage,setComImage]=useState('');
    const [userImage,setUserimage]=useState('');
    const [backgroundColor,setbackgroundColor]=useState('#000000');
    const [textColor,setTextColor]=useState('#ffffff');
    const [iconColor,setIconColor]=useState('#000000');
    const [socialList,setSociallist]=useState([{platform:'',url:''}]);
    const [valid,setValid]=useState(false);
    const [loading,setLoading]=useState(true);
    const [flip,setFlip]=useState(false);
    useEffect(()=>{
        
    const weburl=urldata.id;
        axios.post('http://localhost:3003/userProfile/',{weburl})
        .then(res=>{
          if(res.data.Status==='success'){
            setValid(true);
            setLoading(false);
            var userdata=res.data.user;
            console.log(userdata);
            var userSocial = JSON.parse(userdata.fld_vc_user_social_link);
            setName(userdata.fld_vc_user_name);
            setEmail(userdata.fld_vc_user_email);
            setNumber(userdata.fld_vc_user_number);
            setAddress(userdata.fld_vc_user_address);
            setDesignation(userdata.fld_vc_designation);
            setAbout(userdata.fld_vc_user_about);
            setWebsite(userdata.fld_vc_user_website);
            setCompany(userdata.fld_vc_company_name);
            setSociallist(userSocial);
            setComImage("http://localhost:3003/"+userdata.fld_vc_website_logo)
            setUserimage("http://localhost:3003/"+userdata.fld_vc_user_image)
            setbackgroundColor(userdata.fld_backgroud_color)
            setTextColor(userdata.fld_text_color)
            setIconColor(userdata.fld_icon_color)
            let link = document.querySelector("link[rel~='icon']");
              if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
              }
              link.href = userImage;
          }else{
            console.log(res.data);
          }
        })
        .catch(err=>console.log(err))
      },[urldata.id]);
      const Capitalize=str=>{
        var mystr=str.split(' ');
       var finalstr='';
        for(var u=0; u<mystr.length; u++){
          finalstr+=mystr[u].charAt(0).toUpperCase() + mystr[u].slice(1)+' ';
        }
        return finalstr;
        }
        const printVisitingCard = () =>{     
          let printContents = document.getElementById('VisitingCard').innerHTML;
          let originalContents = document.body.innerHTML;
          document.body.innerHTML = printContents;
          window.print();
         document.body.innerHTML = originalContents; 
        }
        const flipCard=()=>{
          setFlip(!flip);
        }
        const downloadImage = () => {
          var qrcodeUrl='https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:3000/profile'+urldata.id
          saveAs(qrcodeUrl) // Put your image url here.
        }
  return (
    <>
   <Helmet>
    <title>{Capitalize(name)}</title>
    <link rel="icon" type="image/x-icon" href={userImage}></link>
   </Helmet>
    <div className='container'>
        <div className='row'>
            <div className='offset-md-4 col-md-4' id="VisitingCard">
            {loading!==false && valid===false  ? 
             <div className="spinner-overlay">
             <div className="spinner"></div>
           </div>
            :
                
              <div className='row p-3 text-white rounded 'style={{backgroundColor:backgroundColor,height: '100vh'}}>
                {
                  flip===false ?
                  <>
                <div className='col-md-12 compnayImage' >
                { comImage!=='' ?
                    <img src={comImage} width={150} height='auto' className='m-3' alt={company}/>
                    :''
                }
                </div>
                <div className='col-md-12 text-center userImage'>
                    { userImage!=='' ?
                    <img src={userImage} width={100} height={100} className='rounded-circle' alt={name}/>
                        :''
                    }
                    <h4 style={{color:textColor}} className='userName'>{Capitalize(name)}</h4>
                    {designation !=='' ?
                    <hr style={{width:'100px',height:'3px', color:'#efefef', margin:'0 auto'}}/>
                    :''
                    }
                    <h4 style={{color:textColor}} className='userDesination'>{Capitalize(designation)}</h4>
                    {
                        aboutYourself!=='' ?
                        <hr style={{width:'90%',height:'3px', color:'#efefef', margin:'0 auto'}}/>
                        : ''
                    }
                    <p style={{color:textColor,textAlign:'justify'}}>{aboutYourself}</p>
                </div>
                <div className='col-11 pl-3 mt-3 userInformation' >
                    { number!=='' ?
                    <p style={{color:textColor}} className='information'><i className="fa-solid fa-phone" style={{color:iconColor}}></i>&nbsp; <span>+91 {number}</span></p>
                    : '' }
                    {email!=='' ?
                    <p style={{color:textColor}} className='information'><i className="fa-solid fa-envelope" style={{color:iconColor}}></i>&nbsp;&nbsp; <span> {email}</span></p>
                    : '' }
                    { website!=='' ?
                    <p style={{color:textColor}} className='information'><i className="fa-solid fa-globe" style={{color:iconColor}}></i>&nbsp;&nbsp; <span>{website}</span></p>
                    : '' }
                    { address!=='' ?
                    <p style={{color:textColor}} className='information'><i className="fa-solid fa-location-dot" style={{color:iconColor}}></i>&nbsp;&nbsp; <span>{address}</span></p>
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
                
                </>
                :
                <>
                <div className='text-center mt-5'>

                  <img onDoubleClick={downloadImage} alt={name} src={'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=http://localhost:3000/profile'+urldata.id}/>
                  <p>Scan QR Code Or Double Click To Download. </p>
                </div>
                <hr style={{width:'95%',height:'3px', color:'#efefef', margin:'0 auto'}}/>
                <div className='row'>
                  <div className='col-3'>
                    <Link to={''}></Link>
                  </div>
                </div>
                </>
              }
              <hr style={{width:'95%',height:'3px', color:'#efefef', margin:'0 auto'}}/>
                <div className='col-md-12 d-flex'>
                
                <div className='w-50 text-center'>
                  <button className='btn btn-primary' onClick={flipCard} style={{background:iconColor}}>Share</button>
                 
                  </div>
                  <div className='w-50 text-center'>
                  <button className='btn btn-secondary' onClick={printVisitingCard} style={{background:iconColor}}>Save</button>
                  </div>
                </div>
              </div>
            }
            </div>
        </div>
    </div>
    </>
  )
}
