import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const FREE_SCAN_LIMIT = 3;

interface ScanCreditsState {
  creditsRemaining: number;
  freeScansUsed: number;
  freeScansLeft: number;
  isSubscriber: boolean;
  subscriptionTier: string | null;
  canScan: boolean;
  isLoading: boolean;
}

export function useScanCredits() {
  const { user } = useAuth();
  const [state, setState] = useState<ScanCreditsState>({
    creditsRemaining: 0,
    freeScansUsed: 0,
    freeScansLeft: FREE_SCAN_LIMIT,
    isSubscriber: false,
    subscriptionTier: null,
    canScan: true,
    isLoading: true,
  });

  const refreshCredits = useCallback(async () => {
    if (!user) {
      setState(prev => ({ ...prev, isLoading: false, canScan: true }));
      return;
    }

    try {
      // Fetch profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("free_scans_used, subscription_tier, subscription_active")
        .eq("user_id", user.id)
        .single();

      // Fetch scan credits (sum remaining from all packs)
      const { data: credits } = await supabase
        .from("scan_credits")
        .select("credits_remaining")
        .eq("user_id", user.id);

      const freeScansUsed = profile?.free_scans_used ?? 0;
      const freeScansLeft = Math.max(0, FREE_SCAN_LIMIT - freeScansUsed);
      const isSubscriber = profile?.subscription_active ?? false;
      const subscriptionTier = profile?.subscription_tier ?? null;
      const creditsRemaining = credits?.reduce((sum, c) => sum + c.credits_remaining, 0) ?? 0;
      const canScan = isSubscriber || freeScansLeft > 0 || creditsRemaining > 0;

      setState({
        creditsRemaining,
        freeScansUsed,
        freeScansLeft,
        isSubscriber,
        subscriptionTier,
        canScan,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch scan credits:", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user]);

  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);

  const deductScan = useCallback(async () => {
    if (!user) return;

    try {
      // Priority: free scans first, then purchased credits
      if (state.freeScansLeft > 0) {
        const newUsed = state.freeScansUsed + 1;
        await supabase
          .from("profiles")
          .update({ free_scans_used: newUsed })
          .eq("user_id", user.id);

        setState(prev => ({
          ...prev,
          freeScansUsed: newUsed,
          freeScansLeft: Math.max(0, FREE_SCAN_LIMIT - newUsed),
          canScan: prev.isSubscriber || FREE_SCAN_LIMIT - newUsed > 0 || prev.creditsRemaining > 0,
        }));
        return;
      }

      if (state.isSubscriber) {
        // Subscribers don't need to deduct
        return;
      }

      if (state.creditsRemaining > 0) {
        // Find the oldest pack with remaining credits and deduct
        const { data: packs } = await supabase
          .from("scan_credits")
          .select("id, credits_remaining")
          .eq("user_id", user.id)
          .gt("credits_remaining", 0)
          .order("purchased_at", { ascending: true })
          .limit(1);

        if (packs && packs.length > 0) {
          await supabase
            .from("scan_credits")
            .update({ credits_remaining: packs[0].credits_remaining - 1 })
            .eq("id", packs[0].id);

          const newRemaining = state.creditsRemaining - 1;
          setState(prev => ({
            ...prev,
            creditsRemaining: newRemaining,
            canScan: prev.isSubscriber || prev.freeScansLeft > 0 || newRemaining > 0,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to deduct scan:", error);
    }
  }, [user, state.freeScansLeft, state.freeScansUsed, state.isSubscriber, state.creditsRemaining]);

  const purchaseScanPack = useCallback(() => {
    toast.info("🔧 Stripe Setup Required", {
      description: "Scan pack purchases will be available once Stripe is connected. 40 scans for $1.99!",
      duration: 4000,
    });
  }, []);

  const purchaseSubscription = useCallback((tier: string) => {
    toast.info("🔧 Stripe Setup Required", {
      description: `${tier} subscription will be available once Stripe is connected.`,
      duration: 4000,
    });
  }, []);

  const totalScansAvailable = state.isSubscriber
    ? Infinity
    : state.freeScansLeft + state.creditsRemaining;

  return {
    ...state,
    totalScansAvailable,
    deductScan,
    purchaseScanPack,
    purchaseSubscription,
    refreshCredits,
  };
}
