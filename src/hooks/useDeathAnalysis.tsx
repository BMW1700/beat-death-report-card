import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { DeathAnalysis, DetectedItem } from '@/types';

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

  const performAnalysis = async (scenario: string, imageFile?: File) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis (replace with actual AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: DeathAnalysis = {
        item: scenario || "Unknown item",
        allergyRisk: "Moderate",
        killRating: Math.floor(Math.random() * 10) + 1,
        killRatingText: "Moderately Dangerous",
        lethalDose: "Varies by individual",
        timeToDeath: "2-24 hours",
        mechanism: "System failure",
        survival: "Seek immediate medical attention",
        finalWords: "I should have used BeatDeath first...",
        detectedItems: [{
          label: scenario || "Unknown",
          confidence: 0.85,
          toxicityLevel: Math.floor(Math.random() * 10) + 1,
          reason: "Potentially harmful if misused",
          lethalDose: "Varies",
          category: "general"
        }]
      };

      // Save to database
      await saveAnalysis(mockAnalysis, scenario, imageFile);
      
      return mockAnalysis;
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Something went wrong during analysis",
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