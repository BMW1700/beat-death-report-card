import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { DeathAnalysis, DetectedItem } from '@/types';
import { ANALYSIS_STAGES } from '@/utils/imageAnalysis';

export const useDeathAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const saveAnalysis = async (analysis: DeathAnalysis, scenario?: string, imageFile?: File) => {
    if (!user) return null;

    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('death_analyses')
          .upload(fileName, imageFile);
        
        if (uploadError) {
          console.error('Image upload error:', uploadError);
        } else {
          imageUrl = uploadData.path;
        }
      }

      const { data, error } = await supabase
        .from('death_analyses')
        .insert({
          user_id: user.id,
          scenario: scenario || analysis.item,
          image_url: imageUrl,
          item_detected: analysis.item,
          confidence: analysis.detectedItems?.[0]?.confidence || 0.8,
          toxicity_level: analysis.detectedItems?.[0]?.toxicityLevel || 5,
          kill_rating: analysis.killRating || 0,
          kill_rating_text: analysis.killRatingText || 'Unknown',
          lethal_dose: analysis.lethalDose,
          time_to_death: analysis.timeToDeath,
          mechanism: analysis.mechanism,
          survival_tips: analysis.survival,
          final_words: analysis.finalWords,
          category: analysis.detectedItems?.[0]?.category || 'general',
          analysis_type: imageFile ? 'image' : 'text'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving analysis:', error);
        toast({
          title: "Save Failed",
          description: "Couldn't save your death analysis",
          variant: "destructive"
        });
        return null;
      }

      // Award XP for completing analysis
      await awardXP(10, 'analysis_completed');

      return data;
    } catch (error) {
      console.error('Analysis save error:', error);
      return null;
    }
  };

  const awardXP = async (xp: number, reason: string) => {
    if (!user) return;

    try {
      // Update user's total XP
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_xp')
        .eq('user_id', user.id)
        .single();

      const newXP = (currentProfile?.total_xp || 0) + xp;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          total_xp: newXP
        })
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating XP:', profileError);
        return;
      }

      // Create achievement record
      const { error: achievementError } = await supabase
        .from('achievements')
        .insert({
          user_id: user.id,
          achievement_type: reason,
          achievement_name: `Earned ${xp} XP`,
          description: `Received ${xp} XP for ${reason.replace('_', ' ')}`,
          xp_reward: xp,
          rarity: 'common'
        });

      if (achievementError) {
        console.error('Error creating achievement:', achievementError);
      }

      toast({
        title: `+${xp} XP Earned! 💀`,
        description: `Keep analyzing deadly scenarios!`,
      });
    } catch (error) {
      console.error('XP award error:', error);
    }
  };

  const getUserAnalyses = async (limit = 10) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('death_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching user analyses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('User analyses fetch error:', error);
      return [];
    }
  };

  const getPublicAnalyses = async (limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('death_analyses')
        .select(`
          *,
          profiles (
            display_name,
            username
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching public analyses:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Public analyses fetch error:', error);
      return [];
    }
  };

  const likeAnalysis = async (analysisId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('community_interactions')
        .insert({
          user_id: user.id,
          analysis_id: analysisId,
          interaction_type: 'like'
        });

      if (error) {
        console.error('Error liking analysis:', error);
      }
    } catch (error) {
      console.error('Like analysis error:', error);
    }
  };

  const performAnalysis = async (
    scenario: string, 
    imageFile?: File,
    onProgress?: (stage: string, progress: number) => void
  ) => {
    setIsAnalyzing(true);
    
    try {
      onProgress?.(ANALYSIS_STAGES.INITIALIZING.name, ANALYSIS_STAGES.INITIALIZING.progress);
      
      // Get user profile for personalized risk calculation
      const { data: profile } = await supabase
        .from('profiles')
        .select('weight, weight_unit, age, gender, chronic_conditions, allergies')
        .eq('user_id', user?.id)
        .single();

      onProgress?.('Preparing AI analysis...', 15);

      // Convert image to base64 if provided
      let imageBase64 = null;
      if (imageFile) {
        onProgress?.('Processing image...', 20);
        const reader = new FileReader();
        imageBase64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      onProgress?.(ANALYSIS_STAGES.CLASSIFICATION.name, 30);

      // Call the powerful AI edge function with Gemini 2.5 Pro
      console.log('Calling advanced AI death analysis...');
      const { data: aiAnalysis, error: aiError } = await supabase.functions.invoke('analyze-death-risk', {
        body: {
          imageBase64,
          scenario: scenario || null,
          userData: {
            weight: profile?.weight || 150,
            weight_unit: profile?.weight_unit || 'lbs',
            age: profile?.age || 30,
            gender: profile?.gender || 'unknown',
            allergies: profile?.allergies || 'none',
            chronic_conditions: profile?.chronic_conditions || []
          }
        }
      });

      if (aiError) {
        throw new Error(aiError.message || 'AI analysis failed');
      }

      if (!aiAnalysis) {
        throw new Error('No analysis result received from AI');
      }

      onProgress?.(ANALYSIS_STAGES.GENERATING_REPORT.name, 80);

      // Transform AI response to DeathAnalysis format
      const deathAnalysis: DeathAnalysis = {
        item: aiAnalysis.itemDetected || scenario || "Unknown hazard",
        allergyRisk: profile?.allergies ? "High" : "Moderate",
        killRating: aiAnalysis.killRating || 50,
        killRatingText: aiAnalysis.killRatingText || "Moderate Risk",
        lethalDose: aiAnalysis.lethalDose || "Varies",
        timeToDeath: aiAnalysis.timeToImpact || "Unknown",
        mechanism: aiAnalysis.mechanism || "Multiple factors",
        survival: Array.isArray(aiAnalysis.survivalTips) 
          ? aiAnalysis.survivalTips.join(' ') 
          : aiAnalysis.survivalTips || "Seek immediate medical attention",
        finalWords: aiAnalysis.finalWords || '"This was not on my bingo card..."',
        detectedItems: aiAnalysis.detectedItems?.map((item: any) => ({
          label: item.name || item.label,
          confidence: item.confidence || aiAnalysis.confidence || 0.85,
          toxicityLevel: item.toxicityLevel || aiAnalysis.toxicityLevel || 5,
          reason: item.mechanism || item.reason || 'AI-detected hazard',
          lethalDose: item.lethalDose || aiAnalysis.lethalDose,
          category: item.category || aiAnalysis.category || 'unknown',
          sources: item.sources || [],
          threatLevel: (item.toxicityLevel || 5) >= 7 ? 'critical' : 
                      (item.toxicityLevel || 5) >= 5 ? 'high' : 
                      (item.toxicityLevel || 5) >= 3 ? 'moderate' : 'low'
        })) || [{
          label: aiAnalysis.itemDetected || scenario,
          confidence: aiAnalysis.confidence || 0.85,
          toxicityLevel: aiAnalysis.toxicityLevel || 5,
          reason: aiAnalysis.mechanism || 'AI analysis',
          lethalDose: aiAnalysis.lethalDose,
          category: aiAnalysis.category || 'unknown',
          sources: [],
          threatLevel: (aiAnalysis.toxicityLevel || 5) >= 7 ? 'critical' : 
                      (aiAnalysis.toxicityLevel || 5) >= 5 ? 'high' : 
                      (aiAnalysis.toxicityLevel || 5) >= 3 ? 'moderate' : 'low'
        }]
      };

      // Save enhanced analysis to database
      await saveAnalysis(deathAnalysis, scenario, imageFile);
      
      onProgress?.(ANALYSIS_STAGES.COMPLETE.name, ANALYSIS_STAGES.COMPLETE.progress);

      toast({
        title: "🎯 AI Analysis Complete!",
        description: `Powered by Gemini 2.5 Pro - ${deathAnalysis.detectedItems.length} hazard(s) detected`,
      });
      
      return deathAnalysis;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "AI analysis encountered an error",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    performAnalysis,
    saveAnalysis,
    getUserAnalyses,
    getPublicAnalyses,
    likeAnalysis,
    awardXP
  };
};