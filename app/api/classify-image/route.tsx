import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../Firebase'; // Adjust the path as needed

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId');

    if (!file || !userId) {
      return NextResponse.json({ error: 'File and User ID are required' }, { status: 400 });
    }

    // Ensure the file is of type 'File'
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Uploaded file must be a File' }, { status: 400 });
    }

    // Upload the file to Firebase Storage
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, new Uint8Array(await file.arrayBuffer()));
    const url = await getDownloadURL(storageRef);

    // Make a request to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What food item do you see? Give me 1-3 words maximum and don't add a period.",
            },
            {
              type: "image_url",
              image_url: {
                url: url
              }
            },
          ]
        },
      ],
      max_tokens: 300,
    });

    const itemName = response.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ itemName });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
