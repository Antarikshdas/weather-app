const express=require('express');
const path=require('path');
const router=express.Router();
const bodyParser=require('body-parser');
const request=require('request');

const app=express();

app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, ''));
app.use('/form', express.static(__dirname + '/index.ejs'));
app.use(bodyParser.urlencoded({extended: true}));


const apiKey = '22bb1564a3c43b9a8389638679f78c22';

app.get('/',(req,res)=>{
    res.render('index',{weather: null, error:null});
});

app.post('/',(req,res)=>{
    let city=req.body.city;
    let url=`http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

    request(url,(err,response,body)=>{
        if(err){
            return res.render('index',{weather: null, error:'Error...kindly try again...!!!'});
        }
        let weather=JSON.parse(body);
        if(weather.current==undefined){
            return res.render('index',{weather: null, error:'Error...kindly try again...!!!'});
        }
        
        let weathertext=`${weather.location.name}, ${weather.location.country}(${weather.location.localtime}) - It is currently ${weather.current.temperature} degree celsius. Wind speed is ${weather.current.wind_speed} km/hr and humidity is ${weather.current.humidity} percent `;
        res.render('index',{weather: weathertext, error:null});
        
        
        
    });
});

app.use('/',router);

const PORT=process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log('App listening to port 8080');
});
