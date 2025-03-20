import { BotUser } from "../db/models/user.js";


export async function CreateUser(req, res) {
    try {
        const { name, age, height } = req.body;
        if (!name || !age || !height) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newUser = new BotUser({ name, age, height });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function UpdateUser(req,res){
    return res.status(200).json({message:"working"})
}
