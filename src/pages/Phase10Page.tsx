
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const Phase10Page = () => (
  <div className="min-h-screen bg-gradient-to-br from-teal-900 via-indigo-900 to-black text-white">
    <div className="container mx-auto py-10">
      <Card className="mb-8 bg-teal-900 border-teal-500">
        <CardTitle className="text-3xl p-6 text-white">PHASE 10: Live Events & Real-World Activations</CardTitle>
        <CardContent>
          <ul className="list-disc ml-6 text-lg text-gray-200 space-y-1">
            <li>Global BeatDeath Day with special event scans</li>
            <li>In-person scan-off tournaments & pop-up experiences</li>
            <li>Charity partnerships for safety education</li>
            <li>Integration with wearable devices (e.g. smart bands, watches)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Phase10Page;
