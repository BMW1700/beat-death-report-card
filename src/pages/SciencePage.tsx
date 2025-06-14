
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const SciencePage = () => (
  <div className="min-h-screen pt-16 bg-gradient-to-br from-yellow-900 via-yellow-800 to-black text-white">
    <div className="container mx-auto py-10">
      <Card className="mb-8 bg-yellow-900 border-yellow-500">
        <CardTitle className="text-3xl p-6 text-white">Science, Education & Research</CardTitle>
        <CardContent>
          <ul className="list-disc ml-6 text-lg text-gray-200 space-y-1">
            <li>BeatDeath for Schools: Fun safety science education</li>
            <li>Open dataset for death-scenario research</li>
            <li>Citizen scientist dashboard & projects</li>
            <li>Global research collaborations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);
export default SciencePage;
