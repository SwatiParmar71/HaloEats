import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './utils/db.js';
import userRoutes from './Routes/user.route.js';

dotenv.config();

const app=express();
app.use(cors({
    origin:'http://localhost:3000',
    methods:['GET','POST','PUT','DELETE'],
    credentials:true,
    allowedHeaders:['Content-Type','Authorization']
}));
const port=3000;

app.get('/',(req,res)=>{
    res.send('Swati Parmar');
});

app.get('/swati',(req,res)=>{
    res.send('aur bhaiyo kya haal hai');
});

app.get('/aree',(req,res)=>{
    res.send('kya re tu bhi aa gaya');
});

console.log(process.env.PORT);

db();

app.use('/api/users',userRoutes);

app.listen(port,()=>{
    console.log('Server is running on port'+port);
});