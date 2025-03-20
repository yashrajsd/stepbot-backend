import { BotUser } from "../db/models/user.js";
import { Reminder } from "../db/models/reminder.js";

// Weather Tool
export const fetchWeatherByCity = async (data) => {
    const city = data.place
    if(!city){
        return "Couldn't get the city, please say that again"
    }
    try {
        
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&format=json`);
        const geoData = await geoResponse.json();
        if (!geoData.length) throw new Error("City not found");

        const { lat, lon } = geoData[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherData = await weatherResponse.json();

        console.log(`Weather in ${city}:`, weatherData.current_weather.temperature + "°C");
        console.log(`Wind Speed: ${weatherData.current_weather.windspeed} km/h`);

        return weatherData.current_weather;
    } catch (error) {
        console.error("Error fetching weather:", error.message);
    }
};

// User data tool
export const FetchUserData = async (data, userID) => {
    try {
        console.log(data)
        const projection = data.reduce((acc, field) => {
            acc[field] = 1;
            return acc;
        }, {});

        const user = await BotUser.findOne({ _id: userID }, projection);
        return user;
    } catch (err) {
        console.error(err);
        return "Error fetching data";
    }
};

// Reminders tool
export const SetReminder = async(data) => {
    try {
      
      const reminderTime = data.data.remindAt;
      

      let reminderDateTime = new Date(reminderTime);
      
      if (isNaN(reminderDateTime.getTime())) {
        const today = new Date();
        const timeMatch = reminderTime.match(/(\d+)(?::\d+)?\s*(am|pm|AM|PM)?/);
        
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          const isPM = timeMatch[2]?.toLowerCase() === 'pm';
          
    
          if (isPM && hours < 12) hours += 12;
          if (!isPM && hours === 12) hours = 0;
          
          today.setHours(hours, 0, 0, 0);
          reminderDateTime = today;
        }
      }
      

      data.data.remindAt = reminderDateTime.toISOString();
      
      const reminder = await Reminder.create(data.data);
      await reminder.save();
      return "Reminder set for " + reminderDateTime.toLocaleString();
    } catch(err) {
      console.log(err);
      return "Error setting up reminder";
    }
}


