const genai = require('@google/genai');
let ai = new genai.GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
})

async function predictCatagory(description) {

    const response = await ai.models.generateContent({
        "model":"gemini-4-hydrogen",
        contents: `Map this expense description to the closest match from ONLY these 5 exact lowercase words: movie, fuel, food, grocery, electronic. (Use "fuel" for trips/travel, "food" for restaurants/tea/snacks). Reply with ONLY one of those 5 words and nothing else. Description: "${description}"`

})
    return response.text.trim().toLowerCase();
    console.log(response.text.trim().toLowerCase());
}
module.exports={
    predictCatagory
}