import OpenAI from "openai";
import { OpenAIStream } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY || "";

  const openai = new OpenAI({
    apiKey,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [{
      role: "system",
      content: `CONTEXT: You are an expert at predicting the dollar worth of resumes.
      --------
      TASK:
      - You will receive a resume from a user as test input.
      - Analyze the resume and provide an estimated worth in US Dollars.
      - Provide 4 short bullet points explaining the key factors contributing to the assessment,
      and 4 tips on how they can improve their worth. Each bullet point should be less than 1 line.
      --------
      OUTPUT FORMAT:
      <Estimated Worth>$...</Estimated Worth>
      <Explanation>
        <ul>
          <li>...</li>
          <li>...</li>
          <li>...</li>
          ...
        </ul>
      </Explanation>
      <Improvement>
        <ul>
          <li>...</li>
          <li>...</li>
          <li>...</li>
          ...
        </ul>
      </Improvement>`
    },
    { role: "user", content: prompt }
    ],
    stream: true,
    temperature: 1
  });

  const stream = OpenAIStream(response);

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
  