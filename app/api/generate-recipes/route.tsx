import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '../../Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const q = query(collection(db, 'pantry'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map((doc) => doc.data().name).join(', ');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Using the following ingredients: ${items}, generate detailed recipes. Each recipe should be structured with a title, ingredients, and instructions. Give only 3 recipes. Dont add ### or *** in each recipe and only output the what I mentioned. Separate each recipe with a "%".`,
        },
      ],
      max_tokens: 1000,
    });

    const generatedRecipes = response.choices?.[0]?.message?.content?.split('%').map(recipe => recipe.trim()) || [];
    return NextResponse.json({ recipes: generatedRecipes });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
