import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await streamText({
    model: openai("gpt-4-1106-preview"),
    messages: [{
      role: "system", content: `CONTEXT: You are an expert at prediciting the dollar worth of resumes.            
      --------
			TASK: 
			- You will receive a resume from a user as test input.
			- Analyze the resume and provide an estimated worth in US Dollars.
			- Provide 4 short bullet points explanation of the key factors contributing to the assessment,
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
			</Improvement>`},
    { role: "user", content: prompt }
    ],
    temperature: 1
  });

  return result.toDataStreamResponse()
}