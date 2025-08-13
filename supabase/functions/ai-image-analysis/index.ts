import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import OpenAI from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, imageData } = await req.json();
    
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Prepare image for OpenAI Vision
    const imageInput = imageUrl || `data:image/jpeg;base64,${imageData}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14",
      messages: [
        {
          role: "system",
          content: `You are the world's most advanced death analysis AI for the BeatDeath app. Your job is to:

1. ACCURATELY identify the object(s) in the image with 100% precision
2. Analyze potential death/injury risks with scientific accuracy
3. Provide survival tips and safety information
4. Rate danger level 1-10 (10 = immediate death risk)
5. Be darkly humorous but factually correct

You MUST identify common objects correctly (iPhone, food, household items, etc). 

Return ONLY a JSON object with this exact structure:
{
  "itemName": "exact object name",
  "confidence": 0.95,
  "allowCorrection": false,
  "deathRating": 3,
  "riskFactors": ["specific risk 1", "risk 2"],
  "immediateAction": "what to do right now",
  "survivalTips": ["tip 1", "tip 2", "tip 3"],
  "funFact": "darkly humorous but educational fact",
  "category": "household|food|chemical|electronic|weapon|plant|animal|other"
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this image for death potential. Be extremely accurate in identification."
            },
            {
              type: "image_url",
              image_url: {
                url: imageInput,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    
    // Parse the JSON response
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      // Fallback if GPT doesn't return perfect JSON
      analysisResult = {
        itemName: "Unknown Object",
        confidence: 0.5,
        allowCorrection: true,
        deathRating: 5,
        riskFactors: ["Unidentified object risk"],
        immediateAction: "Exercise caution with unknown objects",
        survivalTips: ["Identify the object before use", "Consult experts if unsure", "Keep away from children"],
        funFact: "The most dangerous objects are often the most innocent-looking ones.",
        category: "other"
      };
    }

    // Ensure confidence-based correction allowance
    if (analysisResult.confidence < 0.85) {
      analysisResult.allowCorrection = true;
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("AI Analysis error:", error);
    
    // Fallback response
    const fallbackResponse = {
      itemName: "Analysis Failed",
      confidence: 0.1,
      allowCorrection: true,
      deathRating: 5,
      riskFactors: ["AI analysis unavailable"],
      immediateAction: "Use caution - AI analysis failed",
      survivalTips: ["Manually assess risks", "Consult safety resources", "Exercise extreme caution"],
      funFact: "Even our AI has bad days - but you don't have to!",
      category: "other"
    };

    return new Response(JSON.stringify(fallbackResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});