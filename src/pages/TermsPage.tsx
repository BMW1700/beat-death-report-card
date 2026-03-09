const TermsPage = () => (
  <div className="min-h-screen pt-20 pb-12 px-4 max-w-3xl mx-auto">
    <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
    <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
      <p><strong>Last Updated:</strong> March 9, 2026</p>

      <h2 className="text-xl font-semibold text-foreground">1. Acceptance</h2>
      <p>By using BeatDeath, you agree to these Terms of Service. If you do not agree, do not use the service.</p>

      <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
      <p>BeatDeath is an entertainment and educational health-gamification platform. It provides estimated life expectancy calculations based on user-reported lifestyle data. These are NOT medical diagnoses or advice.</p>

      <h2 className="text-xl font-semibold text-foreground">3. Medical Disclaimer</h2>
      <p>BeatDeath is not a medical device or healthcare provider. All life expectancy estimates, death risk scores, and health suggestions are for entertainment purposes only. Always consult a qualified healthcare professional for medical advice.</p>

      <h2 className="text-xl font-semibold text-foreground">4. User Accounts</h2>
      <p>You are responsible for maintaining the security of your account. You must not share your credentials or use another person's account.</p>

      <h2 className="text-xl font-semibold text-foreground">5. Acceptable Use</h2>
      <p>You agree not to manipulate leaderboards, exploit vulnerabilities, harass other users, or use the platform for any illegal purpose.</p>

      <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
      <p>BeatDeath is provided "as is" without warranties. We are not liable for any decisions made based on information provided by the platform.</p>

      <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
      <p>For questions about these terms, contact <span className="text-primary">legal@beatdeath.com</span>.</p>

      <p className="text-xs text-muted-foreground/60 mt-8">This is a placeholder terms of service. Please have it reviewed by a qualified legal professional before launch.</p>
    </div>
  </div>
);

export default TermsPage;
