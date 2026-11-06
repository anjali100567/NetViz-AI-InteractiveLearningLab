import { NextRequest, NextResponse } from 'next/server';
import { parseWhatIfQuestion } from '@/lib/ai/whatIfParser';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const result = parseWhatIfQuestion(prompt);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to parse scenario', details: String(error) },
      { status: 500 }
    );
  }
}
