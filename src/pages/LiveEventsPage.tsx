
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const LiveEventsPage = () => (
  <div className="min-h-screen pt-16 bg-gradient-to-br from-teal-900 via-indigo-900 to-black text-white">
    <div className="container mx-auto py-10">
      <Card className="mb-8 bg-teal-900 border-teal-500">
        <CardTitle className="text-3xl p-6 text-white">Live Events & IRL Activations</CardTitle>
        <CardContent>
          <ul className="list-disc ml-6 text-lg text-gray-200 space-y-1">
            <li>Global BeatDeath Day & special event challenges</li>
            <li>In-person scan-off tournaments & pop-up experiences</li>
            <li>Charity partnerships for safety education</li>
            <li>Wearable device integrations (bands, watches, etc.)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);
export default LiveEventsPage;
