const port = 8000;
const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const user = JSON.parse(fs.readFileSync('dataBase.json','utf-8'));


// const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended : true}));

app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: 'your_secret_here',
  resave: false,
  saveUninitialized: true
}));




app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/signup',(req,res)=>{
    const error = req.session.error;
    res.render('signup',{error});
});

app.get('/home',(req,res) =>{
   res.render('home')
})



app.post('/login',(req,res)=>{
    const {email,password} = req.body
    const userExist = user.find(fn => fn.email === email && fn.password === password);
    console.log("hjh");
    console.log(userExist);

    if(userExist){
       res.redirect('home');
    }else{
        res.send('incorrect id');
    }
})

app.post('/signup',(req,res)=>{
    console.log(req.body);
    const {name,email,password,password2} = req.body;
     
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    req.session.error = {};
    console.log('email status', emailFormat.test(email));

    if(email === ""){
        req.session.error = "email cannot be empty";
    }else if(!emailFormat.test(email)){
        req.session.error.emailError = " type a valid email";
    }
    if(password === ""){
        req.session.error.upassword ="password cannot be empty";
    }else if(!passFormat.test(password)){
        req.session.error.upassword = "password format is incorrect";
    }
    if(password2 !== password){
        req.session.error.upassword2 = "password doesnt match";
    }
    if(Object.keys(req.session.error).length > 0){
        return res.redirect('/signup');
    }

    user.push(req.body);
    fs.writeFile('dataBase.json',JSON.stringify(user),()=>{
        res.send('succesfully signed up');
    }) 
});





app.listen(port,()=> console.log(  `server is running on http://localhost:8000`));  