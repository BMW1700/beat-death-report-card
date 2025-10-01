import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { useCommunityLearning } from './useCommunityLearning';
import { DeathAnalysis, DetectedItem } from '@/types';
import { analyzeImageForToxicity, generateDeathAnalysisReport, ANALYSIS_STAGES } from '@/utils/imageAnalysis';

export const useDeathAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const communityLearning = useCommunityLearning();

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
        .select('weight, weight_unit, age, chronic_conditions, allergies')
        .eq('user_id', user?.id)
        .single();

      const userWeight = profile?.weight_unit === 'kg' 
        ? profile.weight * 2.20462 // Convert to lbs
        : profile?.weight || 70;

      let analysisResult;
      
      if (imageFile) {
        // Image-based analysis with real AI and streaming progress
        analysisResult = await analyzeImageForToxicity(imageFile, communityLearning, onProgress);
      } else {
        // Text-based scenario analysis
        onProgress?.(ANALYSIS_STAGES.CLASSIFICATION.name, ANALYSIS_STAGES.CLASSIFICATION.progress);
        
        const mockDetection = {
          label: scenario,
          confidence: 75,
          toxicityLevel: 5,
          reason: 'Scenario-based analysis',
          lethalDose: 'Varies by individual',
          category: 'scenario' as const
        };
        
        analysisResult = {
          detectedItems: [mockDetection],
          overallRisk: 5,
          recommendations: ['Exercise caution', 'Seek medical advice if concerned']
        };
      }

      onProgress?.(ANALYSIS_STAGES.GENERATING_REPORT.name, ANALYSIS_STAGES.GENERATING_REPORT.progress);

      // Generate comprehensive death analysis report
      const report = await generateDeathAnalysisReport(
        analysisResult.detectedItems,
        userWeight
      );

      const topItem = analysisResult.detectedItems[0];
      
      const deathAnalysis: DeathAnalysis = {
        item: topItem?.label || scenario || "Unknown item",
        allergyRisk: profile?.allergies ? "High" : "Moderate",
        killRating: report.deathScore,
        killRatingText: report.deathScore >= 8 ? "Extremely Lethal" : 
                        report.deathScore >= 6 ? "Highly Dangerous" :
                        report.deathScore >= 4 ? "Moderately Dangerous" : "Low Risk",
        lethalDose: topItem?.lethalDose || "Varies",
        timeToDeath: report.timeToImpact || topItem?.timeToDeath || "Unknown",
        mechanism: topItem?.reason || "System failure",
        survival: report.survivalTips?.join(' ') || topItem?.survival || analysisResult.recommendations?.join(' ') || "Seek medical attention",
        finalWords: report.finalWords || topItem?.finalWords || "I should have used BeatDeath first...",
        detectedItems: analysisResult.detectedItems.map((item: any) => ({
          label: item.label,
          confidence: item.confidence,
          toxicityLevel: item.toxicityLevel,
          reason: item.reason,
          lethalDose: item.lethalDose,
          category: item.category,
          sources: item.sources,
          threatLevel: item.toxicityLevel >= 7 ? 'critical' : 
                      item.toxicityLevel >= 5 ? 'high' : 
                      item.toxicityLevel >= 3 ? 'moderate' : 'low'
        }))
      };

      // Save enhanced analysis to database
      await saveAnalysis(deathAnalysis, scenario, imageFile);
      
      onProgress?.(ANALYSIS_STAGES.COMPLETE.name, ANALYSIS_STAGES.COMPLETE.progress);

      toast({
        title: "🎯 Analysis Complete!",
        description: `Detected ${analysisResult.detectedItems.length} item(s) with AI confidence`,
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