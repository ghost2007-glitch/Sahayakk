import { withSupabase } from 'npm:@supabase/server@1'

const GEMINI_MODEL = 'gemini-3.8-flash';
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 20; // 10 user + 10 assistant

const systemInstruction = `You are Sahayak, a helpful, respectful digital civic assistant for government services, public schemes, certificates, applications and general citizen guidance.
- Understand questions about government services, documents, schemes and application procedures.
- Give clear, step-by-step explanations in accessible language.
- Support multilingual conversations when the model can reliably handle the requested language, including Telugu, English and Hindi.
- Match the user's language when reasonably possible.
- Ask follow-up questions when essential details are missing.
- Avoid inventing eligibility rules, deadlines, fees, required documents or official links.
- Distinguish general guidance from verified, current official information.
- Prefer official government sources when verified information or links are available.
- Never claim that an application was submitted, a payment completed, a document issued or an application status checked unless the corresponding real integration confirms it.
- Avoid presenting AI-generated content as an official government decision.`;

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    try {
      if (req.method !== 'POST' && req.method !== 'OPTIONS') {
        return Response.json({ error: 'Method not allowed' }, { status: 405 });
      }

      let body: any;
      try {
        body = await req.json();
      } catch {
        return Response.json({ error: 'Invalid request body' }, { status: 400 });
      }

      const userMessage = body.message;
      const history: Array<{ role: string; content: string }> = Array.isArray(body.history)
        ? body.history.slice(-MAX_HISTORY_TURNS)
        : [];

      if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
        return Response.json({ error: 'Message is required' }, { status: 400 });
      }

      if (userMessage.length > MAX_MESSAGE_LENGTH) {
        return Response.json({ error: 'Message is too long (max 2000 characters)' }, { status: 400 });
      }

      const apiKey = Deno.env.get('GEMINI_API_KEY');
      if (!apiKey) {
        console.error('GEMINI_API_KEY is not set in Edge Function secrets');
        return Response.json({ error: 'AI service is not configured. Please contact support.' }, { status: 503 });
      }

      // Build Gemini contents array from history + current message
      const contents = history
        .filter((msg) => msg.role && msg.content)
        .map((msg) => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        }));
      contents.push({ role: 'user', parts: [{ text: userMessage.trim() }] });

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!geminiResponse.ok) {
        const status = geminiResponse.status;
        let errorDetail = '';
        try {
          const errorBody = await geminiResponse.json();
          errorDetail = errorBody?.error?.message || '';
          console.error('Gemini API error:', status, errorDetail);
        } catch {
          console.error('Gemini API error: status', status);
        }

        if (status === 400) {
          return Response.json({ error: 'The request could not be processed. Please try rephrasing your question.' }, { status: 400 });
        }
        if (status === 401 || status === 403) {
          return Response.json({ error: 'AI service authentication failed. Please contact support.' }, { status: 502 });
        }
        if (status === 404) {
          return Response.json({ error: 'AI model is temporarily unavailable. Please try again later.' }, { status: 502 });
        }
        if (status === 429) {
          return Response.json({ error: 'AI service is busy. Please wait a moment and try again.' }, { status: 429 });
        }
        return Response.json({ error: 'AI service encountered an error. Please try again.' }, { status: 502 });
      }

      const data = await geminiResponse.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        const finishReason = data.candidates?.[0]?.finishReason;
        console.error('Empty Gemini response. finishReason:', finishReason);
        if (finishReason === 'SAFETY') {
          return Response.json({ error: 'The response was blocked by safety filters. Please rephrase your question.' }, { status: 400 });
        }
        return Response.json({ error: 'The AI model returned an empty response. Please try again.' }, { status: 502 });
      }

      return Response.json({ reply });
    } catch (error) {
      console.error('Edge Function unhandled error:', error);
      return Response.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
    }
  }),
};
