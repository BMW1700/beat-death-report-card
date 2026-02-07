import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, scenario, userData, isPremium } = await req.json();
    console.log('Analyzing death risk with advanced AI...', { isPremium });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Prepare the AI prompt with comprehensive death analysis instructions
    const systemPrompt = `You are an expert toxicologist, medical professional, and death scenario analyst. Your role is to analyze potential death risks with extreme precision and dark humor.

CRITICAL ANALYSIS REQUIREMENTS:
1. Identify ALL hazardous items, substances, chemicals, or scenarios
2. Calculate lethal doses based on user weight and personal data
3. Provide detailed mechanisms of death
4. Estimate time to death with scientific accuracy
5. Assign a "kill rating" from 0-100 (100 = certain death)
6. Generate survival tips prioritized by effectiveness
7. Include darkly humorous "final words"

USER DATA:
- Weight: ${userData?.weight || 150} ${userData?.weight_unit || 'lbs'}
- Age: ${userData?.age || 30}
- Gender: ${userData?.gender || 'unknown'}
- Allergies: ${userData?.allergies || 'none'}
- Health conditions: ${userData?.chronic_conditions?.length ? JSON.stringify(userData.chronic_conditions) : 'none'}

RESPONSE FORMAT (JSON):
{
  "detectedItems": [
    {
      "name": "item name",
      "category": "food|chemical|pharmaceutical|object|environment",
      "confidence": 0.0-1.0,
      "toxicityLevel": 0-100,
      "lethalDose": "X mg/kg or specific amount",
      "mechanism": "detailed death mechanism",
      "timeToImpact": "minutes/hours/days",
      "symptoms": ["symptom1", "symptom2"]
    }
  ],
  "overallRisk": {
    "killRating": 0-100,
    "killRatingText": "descriptive text",
    "confidence": 0.0-1.0,
    "primaryThreat": "main danger identified"
  },
  "survivalTips": [
    {
      "priority": "critical|high|medium|low",
      "action": "specific action to take",
      "effectiveness": "percentage or description"
    }
  ],
  "finalWords": "darkly humorous last words",
  "medicalAdvice": "when to seek immediate help"
}

Be thorough, scientifically accurate, and entertainingly dark.`;

    let userMessage = '';
    const contentParts: any[] = [];

    if (imageBase64) {
      // Vision analysis with image
      userMessage = scenario 
        ? `Analyze this image for death risks. Context: ${scenario}. Identify all hazardous items, calculate lethal doses, and provide comprehensive survival analysis.`
        : 'Analyze this image for any potential death risks. Identify all hazardous substances, objects, or situations that could cause harm or death.';
      
      contentParts.push({
        type: 'text',
        text: userMessage
      });
      
      contentParts.push({
        type: 'image_url',
        image_url: {
          url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
        }
      });
    } else if (scenario) {
      // Text-only scenario analysis
      userMessage = `Analyze this death scenario: "${scenario}". Provide detailed risk analysis, lethal doses (if applicable), mechanisms of death, time to death, survival strategies, and darkly humorous final words.`;
      contentParts.push({
        type: 'text',
        text: userMessage
      });
    } else {
      throw new Error('Either image or scenario must be provided');
    }

    console.log(`Calling Lovable AI with ${isPremium ? 'Gemini 2.5 Pro' : 'Gemini 2.5 Flash'} for multimodal analysis...`);

    // Use Gemini 2.5 Pro for subscribers, Flash for free/pack users
    const model = isPremium ? 'google/gemini-2.5-pro' : 'google/gemini-2.5-flash';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: contentParts
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API error: ${errorText}`);
    }

    const aiResult = await response.json();
    console.log('AI analysis complete');

    const analysisData = JSON.parse(aiResult.choices[0].message.content);

    // Transform AI response to match expected format
    const transformedAnalysis = {
      detectedItems: analysisData.detectedItems || [],
      killRating: analysisData.overallRisk?.killRating || 50,
      killRatingText: analysisData.overallRisk?.killRatingText || 'Moderate Risk',
      confidence: analysisData.overallRisk?.confidence || 0.8,
      toxicityLevel: Math.round((analysisData.overallRisk?.killRating || 50) / 10),
      lethalDose: analysisData.detectedItems?.[0]?.lethalDose || 'Unknown',
      mechanism: analysisData.detectedItems?.[0]?.mechanism || 'Multiple potential mechanisms',
      timeToImpact: analysisData.detectedItems?.[0]?.timeToImpact || 'Variable',
      symptoms: analysisData.detectedItems?.[0]?.symptoms || [],
      survivalTips: analysisData.survivalTips?.map((tip: any) => tip.action || tip) || [],
      finalWords: analysisData.finalWords || '"Well, this was unexpected..."',
      itemDetected: analysisData.detectedItems?.[0]?.name || analysisData.overallRisk?.primaryThreat || 'Unknown hazard',
      category: analysisData.detectedItems?.[0]?.category || 'unknown',
      medicalAdvice: analysisData.medicalAdvice || 'Seek immediate medical attention if symptoms develop'
    };

    return new Response(
      JSON.stringify(transformedAnalysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in analyze-death-risk:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to analyze death risk. Please try again.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
