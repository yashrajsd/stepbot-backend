import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from 'dotenv'
import { FetchUserData, fetchWeatherByCity, SetReminder } from "./tools.js";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
    model:"gemini-1.5-flash"
})


const ReplyUser = async (query) => {
    const response = await distinguishQuery(query); 

    switch (response.type) {
        case "climate": {
            const weatherData = await fetchWeatherByCity(response);
            if (weatherData && weatherData.temperature) {
                const reply = await ReplyUserQuery(query, weatherData); 
                console.log(reply);
            } else {
                const reply = await ReplyUserQuery(query, "Sorry, I couldn't retrieve weather data for that location.");
                console.log(reply);
            }
            break;
        }
        case "userdata":{
            const userdata = await FetchUserData(response.requiredData,'67dbde18708b0de5f19a2424')
            const reply = await ReplyUserQuery(query,userdata)
            console.log(reply)
            break;
        }
        case "reminder":{
            const reminder = await SetReminder(response)
            const reply = await ReplyUserQuery(query,reminder)
            console.log(reply);
            break;
        }
        default:{
            const reply = await ReplyUserQuery(query);
            console.log(reply);
        } 
    }
};


const distinguishQuery = async (query) => {
    const response = await model.generateContent([
        `You are a smart query distinguisher. Your job is to identify the type of query the user has asked.
            The query can be one of the following types:
            ---
            1️⃣ **Climate** → If the user is asking about weather (state, city, etc.).
               Response format: {"type":"climate","place":"nashik","requiredData":"temperature"}
               
            2️⃣ **UserData** → If the user is asking for data about themselves.
               Response format: {"type":"userdata", "requiredData":["name","age","height","streak"]}
               
            3️⃣ **General** → Any other general query.
               Response format: {"type":"general", "data":(user query as it is)}
               
            3️⃣ **Reminder** → If the user is asking to set a reminder.
               Response format: {"type":"reminder", "data":{"remindAt":time in DATE format,"title":yourself generate the title for it should be short,"message":message to be reminded}}
            ---
            ⚠️ **Strictly return only a valid JSON response**.
            Do not modify the format or add extra text.
        `,
        `User query: ${query}`
    ]);


    let text =  response.response.text();
    

    text = text.trim();
    text = text.replace(/```json|```/g, "");

    try {
        const jsonResponse = JSON.parse(text);
        console.log(jsonResponse);
        return jsonResponse;
    } catch (error) {
        console.error("Error parsing JSON:", error.message, "\nResponse:", text);
    }
};



const ReplyUserQuery = async(query, context) => {
 
    let formattedContext = "";
    if (context && context.temperature !== undefined) {
        formattedContext = `Current weather in ${query.split(" ").pop().replace(/[?.,!]/g, "")}: 
        - Temperature: ${context.temperature}°C
        - Wind Speed: ${context.windspeed} km/h
        - Weather Code: ${context.weathercode}`;
    } else if (context) {
        formattedContext = JSON.stringify(context);
    }

    const response = await model.generateContent([
        `You are an assistant bot named 'Step Bot'.
        Your task is to reply to user queries in a friendly way as a friend and well-wisher.
        You are an expert in health advice and suggest what's best for the user's health and lifestyle.
        
        IMPORTANT: When given weather data, you MUST use it to provide real-time weather information. 
        The weather data includes temperature, wind speed, and other metrics that you should include in your response.
        
        You reply in max 1-2 lines and not a big paragraph.
        You also try to continue the conversation after addressing the user's query.
        
        If weather data is provided in the context, ALWAYS incorporate that specific data in your response.
        If no context is provided and the query requires specific data, apologize and mention you can't provide that information.`,
        `User query: ${query}`,
        `Context: ${formattedContext}`
    ]);
    
    return response.response.text();
}



// Embedding
export const EmbedData = async (query, response) => {
    const model = genAI.getGenerativeModel({
        model: 'text-embedding-004'
    });
    const data = `user query: ${query}\n bot response: ${response}`
    const result = await model.embedContent(JSON.stringify(data));
    return result.embedding;
};


console.log(await ReplyUser("Temperature in nashik rn"))

