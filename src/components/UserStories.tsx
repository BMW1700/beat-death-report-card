
import { useState, useEffect } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Story {
  id: string;
  user: string;
  story: string;
}

export const UserStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('community_interactions')
        .select('id, content, user_id, created_at')
        .eq('interaction_type', 'story')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      // Get display names from profiles_public
      const userIds = [...new Set(data?.map(d => d.user_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles_public')
        .select('user_id, display_name, username')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name || p.username || 'Anonymous']) || []);

      setStories(data?.map(d => ({
        id: d.id,
        user: d.user_id === user?.id ? 'You' : (profileMap.get(d.user_id) || 'Anonymous'),
        story: d.content || ''
      })) || []);
    } catch (error) {
      console.error('Stories fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStory = async () => {
    if (!input.trim()) return;
    if (!user) {
      toast.error("Sign in to share your story");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('community_interactions')
        .insert({
          user_id: user.id,
          interaction_type: 'story',
          content: input.trim()
        });

      if (error) throw error;

      setStories(prev => [{ id: crypto.randomUUID(), user: 'You', story: input.trim() }, ...prev]);
      setInput("");
      toast.success("Story shared! 💀");
    } catch (error) {
      console.error('Error submitting story:', error);
      toast.error("Failed to share story");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="glass-card border-accent/20">
      <CardTitle className="flex items-center gap-2 p-3 text-accent">
        <MessageSquare className="w-5 h-5" />
        User Death Stories
      </CardTitle>
      <CardContent>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Share your wildest death-defying scenario..."
          className="w-full bg-input border-border text-card-foreground rounded p-2 mb-2"
          rows={2}
        />
        <Button size="sm" onClick={addStory} disabled={submitting} className="mb-2">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
          Submit
        </Button>
        <div className="max-h-40 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : stories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-2">No stories yet. Be the first!</p>
          ) : (
            stories.map((s) => (
              <div key={s.id} className="mb-2">
                <span className="font-bold text-primary">{s.user}:</span>{" "}
                <span className="text-foreground">{s.story}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
