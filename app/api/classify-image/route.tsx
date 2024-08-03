// import { NextResponse } from 'next/server';
// import Groq from 'groq-sdk';

// const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

// async function classifyImage(base64: string) {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: "user",
//         content: `What food item do you see give me one word? https://firebasestorage.googleapis.com/v0/b/pantry-tracker-b865c.appspot.com/o/banana.jpg?alt=media&token=6ce46dce-7451-473b-b9e0-12cf0ea1f938`,
//       },
//     ],
//     model: "llama3-70b-8192", 
//   });
// }

// export async function POST(req: Request) {
//   try {
//     const { image } = await req.json();
//     if (!image) {
//       return NextResponse.json({ error: 'Image is required' }, { status: 400 });
//     }

//     const classification = await classifyImage(image);
//     return NextResponse.json(classification.choices[0]?.message?.content || "No response");
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }


// app/api/classify-image/route.ts

import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY });

async function classifyImage(imageUrl: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `What food item do you see? Give me one word. ${imageUrl}`,
      },
    ],
    model: "llama3-70b-8192",
  });
}

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    console.log('Image URL:', imageUrl); // Log the received image URL

    const classification = await classifyImage(imageUrl);
    const content = classification.choices[0]?.message?.content || "No response";

    console.log('Classification content:', content); // Log the classification result

    return NextResponse.json({ itemName: content });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
