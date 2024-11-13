import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res)=>{
    res.render('index.ejs');
})
app.post('/uvIndex', async (req,res)=>{
    const area=req.body.areaInput;
    const date_time=new Date();
    const now=date_time.toISOString();
    try {
        let LatLonApi=await axios.get(`https://geocode.maps.co/search?q=${area}&api_key=6732ad5b91380695916198hkdfc1937`);
        let LatLonRes=LatLonApi.data[0];
        let AltiApi=await axios.get(`https://api.open-meteo.com/v1/elevation?latitude=${LatLonRes.lat}&longitude=${LatLonRes.lon}`);
        let AltiRes=AltiApi.data.elevation[0];
        let UVIApi=await axios.get(`https://api.openuv.io/api/v1/uv?lat=${LatLonRes.lat}&lng=${LatLonRes.lon}&alt=${AltiRes}&dt=${now}`,{
            headers:{
                'x-access-token': 'openuv-6vxrm3dpkd1q-io'
            },
        });
        let UVIRes=UVIApi.data.result.uv;
        // console.log(area);
        // console.log(LatLonRes);
        // console.log(AltiRes);
        // console.log(area);
        res.render('index.ejs',{
            area:area,
            uvi:UVIRes,
        });
    } catch (error) {
        console.log(error);
    }
})
app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})