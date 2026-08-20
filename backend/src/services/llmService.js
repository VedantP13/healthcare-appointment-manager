const { GoogleGenAI } = require('@google/genai');

const generatePreVisitSummary = async (symptoms) => {
    // Set this to false ONLY when test the real AI or do the final demo
    const USE_MOCK_AI = true; 

    if (USE_MOCK_AI) {
        console.log("🤖 Returning mock AI response to save API quota...");
        return {
            summary: `(MOCK) The patient reported the following: ${symptoms.substring(0, 30)}...`,
            urgency: "Medium"
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `You are a medical AI assistant. Analyze the following patient symptoms and provide a brief, professional pre-visit summary for the doctor (max 3 sentences). Also, determine the urgency level (must be exactly one of these words: Low, Medium, High). 
        Symptoms: ${symptoms}
        Format your response exactly like this:
        Summary: [Your summary here]
        Urgency: [Low/Medium/High]`;

        const interaction = await ai.interactions.create({
            model: "gemini-3.7-flash",
            input: prompt
        });

        const responseText = interaction.output_text;

        const summaryMatch = responseText.match(/Summary:\s*(.*)/i);
        const urgencyMatch = responseText.match(/Urgency:\s*(Low|Medium|High)/i);

        return {
            summary: summaryMatch ? summaryMatch[1].trim() : "Summary unavailable.",
            urgency: urgencyMatch ? urgencyMatch[1] : "Medium"
        };
    } catch (error) {
        console.error("LLM Generation Error:", error);
        return { summary: "Failed to generate summary.", urgency: "Medium" };
    }
};

module.exports = { generatePreVisitSummary };