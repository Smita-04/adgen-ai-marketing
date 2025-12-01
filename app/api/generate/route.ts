import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { productName, audience } = await req.json();

    // Use Gemini 1.5 Flash (It's fast and free)
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

    const prompt = `
      You are a creative marketing expert.
      Product: "${productName}"
      Target Audience: "${audience}"
      
      Generate a JSON object with two fields:
      1. "caption": A short, viral Instagram caption with hashtags and emojis.
      2. "imagePrompt": A highly detailed prompt for an AI image generator describing the product in a professional setting.
      
      Return ONLY valid JSON. Do not use markdown blocks.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean the text just in case the AI adds markdown symbols
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}