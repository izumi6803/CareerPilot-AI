import dotenv from 'dotenv';
dotenv.config();

const EXTRACTION_MODEL = 'gemini-2.0-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';

const isApiKey = GEMINI_API_KEY.startsWith('AIza');

function buildUrl(model: string): string {
  const base = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  return isApiKey ? `${base}?key=${GEMINI_API_KEY}` : base;
}

const PROMPT = `Extract all text content from this CV/resume document.

Return the complete structured text with these sections:

=== CANDIDATE SUMMARY ===
(one-paragraph professional summary)

=== SKILLS ===
(bullet list of all technical and soft skills mentioned)

=== PROJECTS ===
(project name, description, technologies used, role — one per project)

=== WORK EXPERIENCE ===
(company, role, dates, responsibilities, achievements — one per position)

=== EDUCATION ===
(degrees, institutions, graduation years)

=== CERTIFICATIONS ===
(certification name and issuer)

Return ONLY the extracted text. Use the section headers exactly as shown above.`;

async function callGemini(model: string, buffer: Buffer, mimeType: string): Promise<string> {
  const base64 = buffer.toString('base64');

  const body = {
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64 } },
        { text: PROMPT },
      ],
    }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (!isApiKey && GEMINI_API_KEY) {
    headers['Authorization'] = `Bearer ${GEMINI_API_KEY}`;
  }

  console.log(`[Gemini] Calling ${model} with ${mimeType}, base64 length: ${base64.length}`);
  const res = await fetch(buildUrl(model), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => 'unknown error');
    throw new Error(`Gemini API error (${res.status}): ${errText.slice(0, 500)}`);
  }

  const data = await res.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!text?.trim()) {
    const finishReason = data?.candidates?.[0]?.finishReason ?? 'unknown';
    const blockReason = data?.promptFeedback?.blockReason ?? 'none';
    throw new Error(`Gemini returned empty text — finishReason: ${finishReason}, blockReason: ${blockReason}`);
  }

  return text;
}

export async function extractCVWithGemini(buffer: Buffer, mimeType: string): Promise<string> {
  const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const text = await callGemini(model, buffer, mimeType);
      console.log(`[Gemini] ${model} succeeded: ${text.length} chars`);
      return text;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[Gemini] ${model} failed:`, lastError.message);
    }
  }

  throw lastError ?? new Error('All Gemini models failed');
}
