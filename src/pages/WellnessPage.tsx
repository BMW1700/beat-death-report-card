
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const WellnessPage = () => (
  <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-900 via-pink-900 to-black text-white">
    <div className="container mx-auto py-10">
      <Card className="mb-8 bg-pink-900 border-pink-500">
        <CardTitle className="text-3xl p-6 text-white">Health & Wellness Integrations</CardTitle>
        <CardContent>
          <ul className="list-disc ml-6 text-lg text-gray-200 space-y-1">
            <li>Connect with Apple Health, Google Fit, etc</li>
            <li>Custom death risk tips based on real health data</li>
            <li>“Wellness Mode” for proactive risk reduction</li>
            <li>Partnered life/health insurance recommendations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);
export default WellnessPage;
