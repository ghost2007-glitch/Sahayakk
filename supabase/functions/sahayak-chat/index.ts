import { withSupabase } from 'npm:@supabase/server@1'

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
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
      }

      const body = await req.json();
      const userMessage = body.message;
      const history = body.history || [];

      if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
        return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
      }
      
      if (userMessage.length > 2000) {
        return new Response(JSON.stringify({ error: 'Message is too long' }), { status: 400 });
      }

      const apiKey = Deno.env.get("GEMINI_API_KEY");
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'AI service configuration is missing' }), { status: 500 });
      }

      const contents = history.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: userMessage }] });

      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: { text: systemInstruction }
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API Error:', errorText);
        return new Response(JSON.stringify({ error: 'Failed to generate response' }), { status: 502 });
      }

      const data = await geminiResponse.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!reply) {
        return new Response(JSON.stringify({ error: 'Received empty response from AI model' }), { status: 502 });
      }

      // If we wanted to save to database we could do it here using ctx.supabase or ctx.supabaseAdmin
      // However the prompt says "If database changes are not required for the initial AI integration, keep the first implementation focused on working chat responses."
      // Since it's not strictly required yet and we want a minimum viable first step, we just return the reply.
      
      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Edge Function Error:', error);
      return new Response(JSON.stringify({ error: 'An unexpected error occurred processing your request' }), { status: 500 });
    }
  })
}
