const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./database');
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const server = app.listen(port, () => console.log('Server Listing on port ' + port));
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static('uploads'))
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: 'error', message: "User is not Authenticate" });
    } else {
        jwt.verify(token, 'jwt-auth-token-by-mdaziz', (err, decoded) => {
            if (err) {
                return res.json({ status: 'error', message: "Authentication code not match!!!" });
            } else {
                req.userId = decoded.userId;
                next();
            }
        });
    }
}
app.get('/', verifyUser, (req, res) => {
    const userId = req.userId;
    const chksql = "select * from users_tbl where fld_id=" + userId;
    db.query(chksql, async (err, data) => {
        if (err) return res.json({ status: 'error', message: "User is not Authenticate" });
        return res.json({ Status: 'success', user: data[0] });
    });
});
app.get('/logout', verifyUser, (req, res) => {
    const userId = req.userId;
    const curentdatetime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Calcutta' });
    console.log('cur time -logout ' + curentdatetime);
    var datetime = curentdatetime.replace(/T/, ' ').
        replace(/\..+/, '')

    const sql = "update users_tbl set fld_is_active='in-active' , fld_last_seen='" + datetime + "' where fld_id=" + userId;
    db.query(sql, (err, data) => {

    });
    res.clearCookie('token');
    return res.json({ Status: 'success' })
});
app.post('/create', (req, res) => {
    const email = req.body.email;
    const number = req.body.number;
    const chksql = "select * from users_tbl where fld_email='" + email + "' or fld_number=" + number;
    db.query(chksql, async (err, data) => {
        if (err) return res.json(err);
        if (data.length > 0) {
            return res.json({ Status: 'failed', message: 'Email id or Number already exists!!!' });
        } else {
            const curentdatetime = new Date().toISOString('en-US', {
                timeZone: 'Asia/Calcutta'
            });
            datetime = curentdatetime.replace(/T/, ' ').
                replace(/\..+/, '')
            const encPassword = await bcrypt.hash(req.body.password, 3)
            const sql = "INSERT INTO `users_tbl`(`fld_name`, `fld_email`, `fld_number`, `fld_password`, `fld_time`) VALUES (?)";
            const values = [
                req.body.name,
                email,
                number,
                encPassword,
                datetime
            ];
            db.query(sql, [values], (err, data) => {
                if (err) return res.json({ Status: 'failed', message: err });
                const userId = data.insertId;
                const token = jwt.sign({ userId }, 'jwt-auth-token-by-mdaziz', { expiresIn: '1d' });
                res.cookie('token', token);
                return res.json({ Status: 'success', message: 'User Login Successfully' });
                // return res.json(data);
            });
        }
    });
});
app.post('/login', (req, res) => {
    const email = req.body.email;

    const chksql = "select * from users_tbl where fld_email='" + email + "'";
    db.query(chksql, async (err, data) => {
        if (err) return res.json({ Status: 'failed', message: err });
        if (data.length > 0) {
            var result = await bcrypt.compare(req.body.password, data[0].fld_password)
            if (result === true) {
                const userId = data[0].fld_id;
                const token = jwt.sign({ userId }, 'jwt-auth-token-by-mdaziz', { expiresIn: '1d' });
                res.cookie('token', token);
                return res.json({ Status: 'success', user: data[0] });
            } else {
                return res.json({ Status: 'failed', message: 'Invalid Credential!!!' });
            }
        } else {
            return res.json({ Status: 'failed', message: 'Invalid Credential!!!' });
        }
    })
});
const cpUpload = upload.fields([{ name: 'companyImage'}, { name: 'userImage'}])
app.post('/create/profile', verifyUser, cpUpload, async,(req, res) => {
    const userId = req.userId;
    const email = req.body.email;
    const number = req.body.number;
    var weburl = req.body.weburl;
    const socialList = req.body.socialList;
    const curentdatetime = new Date().toISOString('en-US', {
        timeZone: 'Asia/Calcutta'
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0,10);
    datetime = curentdatetime.replace(/T/, ' ').
        replace(/\..+/, '')
       const chksql="select * from visiting_card_tbl where  fld_vc_user_id="+userId+"";
       db.query(chksql,async (err,data)=>{
        if(err) return res.json({Status:'failed',message:err});
        if(data.length>0){
            if(typeof req.body.companyImage!='undefined'){
                var CompanyImage='';
            }else{
        //         await sharp(req.files['companyImage'][0].path)
        // .resize(300, 300)
        // .jpeg({ quality: 90 })
        // .toFile(
        //     path.resolve(req.files['companyImage'][0].destination,'resized',image)
        // )
        // fs.unlinkSync(req.file.path)
                var CompanyImage=",`fld_vc_website_logo`='"+req.files['companyImage'][0].path+"'";
            }
            if(typeof req.body.userImage!='undefined'){
                var userImage='';
            }else{
                var userImage=",`fld_vc_user_image`='"+req.files['userImage'][0].path+"'";
            }
            const updatesql="UPDATE `visiting_card_tbl` SET `fld_vc_url`='"+req.body.weburl+"',`fld_vc_user_name`='"+req.body.name+"',`fld_vc_designation`='"+req.body.designation+"'"+userImage+",`fld_vc_user_about`='"+req.body.about+"',`fld_vc_user_email`='"+req.body.email+"',`fld_vc_user_number`="+req.body.number+",`fld_vc_user_website`='"+req.body.website+"',`fld_vc_user_address`='"+req.body.address+"',`fld_vc_user_social_link`='"+req.body.socialList+"'"+CompanyImage+",`fld_vc_company_name`='"+req.body.company+"',`fld_vc_user_gender`='"+req.body.gender+"',`fld_backgroud_color`='"+req.body.backgroundColor+"',`fld_text_color`='"+req.body.textColor+"',`fld_icon_color`='"+req.body.iconColor+"' WHERE fld_vc_user_id="+userId+"";
            db.query(updatesql, (err, data) => {
                if (err) return res.json({ Status: 'failed', message: err });
                return res.json({ Status: 'success', message: 'User Profile Updated Successfully' });
            });
        }else{


            if(typeof req.body.companyImage!='undefined'){

                var CompanyImage='';
            }else{
                var CompanyImage=req.files['companyImage'][0].path;
            }
            if(typeof req.body.companyImage!='undefined'){
                var userImage='';
            }else{
                var userImage=req.files['userImage'][0].path;
            }
            const sql = "INSERT INTO `visiting_card_tbl`( `fld_vc_url`, `fld_vc_user_id`, `fld_vc_user_name`, `fld_vc_designation`, `fld_vc_user_email`, `fld_vc_user_number`, `fld_vc_user_website`, `fld_vc_user_address`, `fld_vc_user_social_link`, `fld_vc_company_name`,`fld_vc_website_logo`,`fld_vc_user_image`,`fld_vc_user_gender`, `fld_vc_status`, `fld_vc_date`, `fld_vc_time`) VALUES (?)";
            const values = [
                weburl,
                userId,
                req.body.name,
                req.body.designation,
                email,
                number,
                req.body.website,
                req.body.address,
                socialList,
                req.body.company,
                CompanyImage,
                userImage,
                req.body.gender,
                'active',
                formattedDate,
                datetime
            ];
            db.query(sql, [values], (err, data) => {
                if (err) return res.json({ Status: 'failed', message: err });
                const userId = data.insertId;
                return res.json({ Status: 'success', message: 'User Profile Created Successfully' });
            });
        }
       });

    

});
app.get('/getProfile', verifyUser, (req, res) => {
    const userId = req.userId;
    const chksql = "select * from visiting_card_tbl where fld_vc_user_id=" + userId;
    db.query(chksql, async (err, data) => {
        if (err) return res.json({ status: 'error', message: "User is not Authenticate" });
        if(data.length>0){
            return res.json({ Status: 'success', user: data[0] });
        }else{
            return res.json({ status: 'error', message: "User is new" }); 
        }
    });
});
app.post('/check/url',(req,res)=>{
    const url=req.body.url;
    const sql="SELECT * FROM `visiting_card_tbl` WHERE `fld_vc_url`='"+url+"'";
    db.query(sql,(err,data)=>{
        if (err) return res.json({ status: 'error', message: "Something Error try again" });
        if(data.length>0){
            return res.json({ status: 'error', message: "Profile URL already used!!!" });
        }else{
            return res.json({ status: 'success', message: "Profile URL is available :)" });
        }
    });
});

app.post('/userProfile', (req, res) => {
    const weburl = req.body.weburl;
    const chksql = "select * from visiting_card_tbl where fld_vc_url='"+weburl+"'";
    //console.log(chksql);
    db.query(chksql, async (err, data) => {
        if (err) return res.json({ Status: 'error', message: "User is not Valid" });
        if(data.length>0){
            return res.json({ Status: 'success', user: data[0] });
        }else{
            return res.json({ Status: 'error', message: "User is not valid" }); 
        }
    });
});
app.get('/userProfile/:id', (req, res) => {
    const weburl = req.params.id;
    const chksql = "select * from visiting_card_tbl where fld_vc_url='"+weburl+"'";
   // console.log(chksql);
    db.query(chksql, async (err, data) => {
        if (err) return res.json({ Status: 'error', message: "User is not Valid" });
        if(data.length>0){
            return res.json({ Status: 'success', user: data[0] });
        }else{
            return res.json({ Status: 'error', message: "User is not valid" }); 
        }
    });
});