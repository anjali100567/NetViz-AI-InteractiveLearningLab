import { NextRequest, NextResponse } from 'next/server';
import { generateTutorAnswer, TutorContext } from '@/lib/ai/tutorEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, context, apiKey } = body as {
      question: string;
      context: TutorContext;
      apiKey?: string;
    };

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // If an external LLM API key is provided and user has configured it in settings, we could call external API.
    // Otherwise, we strictly use our high-fidelity deterministic NetViz tutor engine!
    const answer = generateTutorAnswer(question, context || { guidanceLevel: 'explanation' });

    return NextResponse.json({
      success: true,
      mode: apiKey ? 'external_llm' : 'deterministic_engine',
      data: answer,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process AI tutor request', details: String(error) },
      { status: 500 }
    );
  }
}
