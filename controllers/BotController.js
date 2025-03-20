import { ReplyUser } from "../lib/gemini.js";

export async function GenerateResponse(req,res){
    const {query} = req.body;
    try{
        const reply = await ReplyUser(query)
        res.status(200).json({botReply:reply})
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Internal server error!"})
    }
}