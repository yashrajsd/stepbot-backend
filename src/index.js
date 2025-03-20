import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { clerkMiddleware } from '@clerk/express'
import dbconnect from '../db/db.js';
import { BotRouter } from '../routes/botRoute.js';
import { UserRoute } from '../routes/userRoute.js';

dotenv.config()
const app = express();

app.use(clerkMiddleware())
app.use(cors())
app.use(express.json())

await dbconnect()


app.use('/api/user',UserRoute)
app.use('/api/bot',BotRouter)

app.get("/",(req,res)=>{
    return res.send("Server is running")
})



app.listen(process.env.PORT || 3002,()=>{
    console.log("Server running on PORT: ",process.env.PORT)
})