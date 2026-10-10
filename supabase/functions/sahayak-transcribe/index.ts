import { withSupabase } from 'npm:@supabase/server@1';

const GEMINI_MODEL = 'gemini-3.8-flash';

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

      const { audioBase64, mimeType, language } = body;

      if (!audioBase64) {
        return Response.json({ error: 'Audio data is required' }, { status: 400 });
      }

      const apiKey = Deno.env.get('GEMINI_API_KEY');
      if (!apiKey) {
        console.error('GEMINI_API_KEY is not set in Edge Function secrets');
        return Response.json({ error: 'AI service is not configured. Please contact support.' }, { status: 503 });
      }

      const prompt = language && language !== 'auto'
        ? `Transcribe this audio precisely. The expected language is ${language}. Reply ONLY with the transcription, no additional text.`
        : `Transcribe this audio precisely in its original language. Reply ONLY with the transcription, no additional text.`;

      const contents = [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: audioBase64
              }
            }
          ]
        }
      ];

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      });

      if (!response.ok) {
        const errData = await response.text();
        console.error('Gemini API Error:', errData);
        return Response.json({ error: 'AI service encountered an error during transcription.' }, { status: 502 });
      }

      const data = await response.json();
      const transcript = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return Response.json({ transcript: transcript.trim() });
    } catch (err: any) {
      console.error('Transcription function exception:', err);
      return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }),
};
