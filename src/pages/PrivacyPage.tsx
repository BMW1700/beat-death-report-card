const PrivacyPage = () => (
  <div className="min-h-screen pt-20 pb-12 px-4 max-w-3xl mx-auto">
    <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
    <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
      <p><strong>Last Updated:</strong> March 9, 2026</p>

      <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
      <p>We collect information you provide during account creation and onboarding, including email address, age, gender, health-related preferences, and lifestyle habits. We also collect usage data such as actions logged, scan history, and achievement progress.</p>

      <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
      <p>Your data powers your personalized Life Clock calculations, achievement tracking, and leaderboard rankings. We use aggregated, anonymized data to improve our algorithms and community features.</p>

      <h2 className="text-xl font-semibold text-foreground">3. Data Sharing & Consent</h2>
      <p>Your data consent level (set during onboarding) controls what is shared publicly. Users with "Private" consent will not appear in the Live Global Feed or community features. We never sell individual health data to third parties.</p>

      <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
      <p>We use industry-standard encryption, row-level security policies, and secure authentication to protect your data. Sensitive health information is only accessible to you.</p>

      <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
      <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us. GDPR and CCPA rights are respected for all users.</p>

      <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
      <p>For privacy inquiries, contact us at <span className="text-primary">privacy@beatdeath.com</span>.</p>

      <p className="text-xs text-muted-foreground/60 mt-8">This is a placeholder privacy policy. Please have it reviewed by a qualified legal professional before launch.</p>
    </div>
  </div>
);

export default PrivacyPage;
