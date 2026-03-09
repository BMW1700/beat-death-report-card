import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skull, Mail, Lock, User, Eye, EyeOff, ArrowRight, RefreshCw, CheckCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !username) {
      toast({ title: "Missing Information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { username, display_name: username }
        }
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({ title: "Account Exists", description: "This email is already registered. Try logging in instead.", variant: "destructive" });
        } else {
          toast({ title: "Sign Up Failed", description: error.message, variant: "destructive" });
        }
      } else {
        // Check if user needs email confirmation
        const needsConfirmation = data.user && !data.user.confirmed_at && data.user.identities?.length === 1;
        if (needsConfirmation) {
          setAwaitingConfirmation(true);
          setResendCooldown(60);
          toast({
            title: "Check Your Email! 📬",
            description: "We sent a confirmation link to your email. Click it to activate your account.",
            duration: 8000
          });
        } else {
          toast({ title: "Welcome to BeatDeath! 💀", description: "Your account is ready!", duration: 4000 });
          navigate("/");
        }
      }
    } catch {
      toast({ title: "Unexpected Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) {
        toast({ title: "Resend Failed", description: error.message, variant: "destructive" });
      } else {
        setResendCooldown(60);
        toast({ title: "Email Resent! 📬", description: "Check your inbox (and spam folder) for the confirmation link." });
      }
    } catch {
      toast({ title: "Unexpected Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing Information", description: "Please enter your email and password", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setAwaitingConfirmation(true);
          setIsLogin(false);
          toast({ title: "Email Not Confirmed", description: "Please confirm your email first. Check your inbox!", variant: "destructive" });
        } else if (error.message.includes("Invalid login credentials")) {
          toast({ title: "Login Failed", description: "Invalid email or password. Please check your credentials.", variant: "destructive" });
        } else {
          toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Welcome Back! 💀", description: "Ready to continue your deadly adventures?" });
        navigate("/");
      }
    } catch {
      toast({ title: "Unexpected Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` }
      });
      if (error) {
        toast({ title: "Google Sign-In Failed", description: error.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Unexpected Error", description: "Something went wrong with Google sign-in.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Awaiting email confirmation screen
  if (awaitingConfirmation) {
    return (
      <div className="min-h-screen gradient-secondary-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="glass-card shadow-xl text-center">
            <CardContent className="p-8 space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <Mail className="w-16 h-16 text-primary" />
                  <CheckCircle className="w-6 h-6 text-success absolute -bottom-1 -right-1" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold font-playfair gradient-text mb-2">Check Your Email!</h2>
                <p className="text-muted-foreground">
                  We sent a confirmation link to <span className="text-foreground font-medium">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click the link in your email to activate your BeatDeath account.
                </p>
              </div>

              <div className="bg-primary/10 rounded-lg p-4 text-sm text-muted-foreground">
                <p>📧 Don't see it? Check your spam/junk folder.</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendConfirmation}
                  disabled={resendCooldown > 0 || loading}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Confirmation Email"}
                </Button>

                <button
                  onClick={() => { setAwaitingConfirmation(false); setIsLogin(true); }}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors w-full"
                >
                  Back to Sign In
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-secondary-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Skull className="w-8 h-8 text-destructive animate-death-pulse" />
            <h1 className="text-4xl font-bold font-playfair gradient-text">BeatDeath</h1>
            <Skull className="w-8 h-8 text-destructive animate-death-pulse" />
          </div>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back to your deadly journey" : "Join the ultimate survival community"}
          </p>
        </div>

        <Card className="glass-card shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">{isLogin ? "Sign In" : "Create Account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a deadly username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@death.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a deadly password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gradient-bg text-primary-foreground font-medium hover:scale-105 transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </Button>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsLogin(!isLogin); setAwaitingConfirmation(false); }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                disabled={loading}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {!isLogin && (
              <div className="mt-4 text-xs text-muted-foreground text-center">
                By signing up, you agree to receive darkly humorous death analyses for entertainment purposes only.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          ⚠️ For Entertainment Only - Not Medical Advice ⚠️
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
