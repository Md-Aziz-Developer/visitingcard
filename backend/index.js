const express =require('express');
const cors =require('cors');
const app=express();
const port=3003;
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const db=require('./database');
const server=app.listen(port,()=>console.log('Server Listing on port '+port));
app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","POST"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
const verifyUser = (req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.json({status:'error',message:"User is not Authenticate"});
    }else{
        jwt.verify(token,'jwt-auth-token-by-mdaziz',(err,decoded)=>{
            if(err){
                return res.json({status:'error',message:"Authentication code not match!!!"});
            }else{
                req.userId=decoded.userId;
                next();
            }
        });
    }
}
app.get('/',verifyUser,(req,res)=>{
    const userId=req.userId;
    const chksql="select * from users_tbl where fld_id="+userId;
    db.query(chksql,async(err,data)=>{
        if(err) return res.json({status:'error',message:"User is not Authenticate"});
        return res.json({Status:'success',user:data[0]});
    });
});
app.get('/logout',verifyUser,(req,res)=>{
    const userId=req.userId;
    const curentdatetime=new Date().toLocaleString('en-US', { timeZone: 'Asia/Calcutta' });
    console.log('cur time -logout '+curentdatetime);
    var datetime=curentdatetime.replace(/T/, ' ').
    replace(/\..+/, '')

    const sql="update users_tbl set fld_is_active='in-active' , fld_last_seen='"+datetime+"' where fld_id="+userId;
    db.query(sql,(err,data)=>{

    });
    res.clearCookie('token');
    return res.json({Status:'success'})
});
app.post('/create', (req,res)=> {
    const email=req.body.email;
    const number=req.body.number;
    const chksql="select * from users_tbl where fld_email='"+email +"' or fld_number="+number;
    db.query(chksql,async(err,data)=>{
        if(err) return res.json(err);
        if(data.length>0){
            return res.json({Status:'failed',message:'Email id or Number already exists!!!'});
        }else{
            const curentdatetime=new Date().toISOString('en-US', {
                timeZone: 'Asia/Calcutta'
            });
            datetime=curentdatetime.replace(/T/, ' ').
            replace(/\..+/, '')
            const encPassword=await bcrypt.hash(req.body.password,3)
            const sql="INSERT INTO `users_tbl`(`fld_name`, `fld_email`, `fld_number`, `fld_password`, `fld_time`) VALUES (?)";
            const values=[
                req.body.name,
                email,
                number,
                encPassword,
                datetime
            ];
            db.query(sql,[values],(err,data)=>{
                if(err) return res.json({Status:'failed',message:err});
                 const userId=data.insertId;
                const token=jwt.sign({userId},'jwt-auth-token-by-mdaziz',{expiresIn: '1d'});
                res.cookie('token',token);
                return res.json({Status:'success',message:'User Login Successfully'});
               // return res.json(data);
            }); 
        }
    });
});
app.post('/login', (req,res)=>{
    const email=req.body.email;
    
    const chksql="select * from users_tbl where fld_email='"+email +"'";
    db.query(chksql,async(err,data)=>{
        if(err) return res.json({Status:'failed',message:err});
        if(data.length>0){
             var result=await bcrypt.compare(req.body.password,data[0].fld_password)
            if(result===true){
                const userId=data[0].fld_id;
                const token=jwt.sign({userId},'jwt-auth-token-by-mdaziz',{expiresIn: '1d'});
                res.cookie('token',token);
                return res.json({Status:'success',user:data[0]});
            }else{
                return res.json({Status:'failed',message:'Invalid Credential!!!'});
            }
        }else{
            return res.json({Status:'failed',message:'Invalid Credential!!!'});
        }
    })
})