
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const Phase12Page = () => (
  <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-yellow-800 to-black text-white">
    <div className="container mx-auto py-10">
      <Card className="mb-8 bg-yellow-900 border-yellow-500">
        <CardTitle className="text-3xl p-6 text-white">PHASE 12: Education, Research & Citizen Science</CardTitle>
        <CardContent>
          <ul className="list-disc ml-6 text-lg text-gray-200 space-y-1">
            <li>BeatDeath for Schools program: fun safety science education</li>
            <li>Open dataset for death scenario research</li>
            <li>Citizen scientist dashboard & projects</li>
            <li>Global research collaborations for real-world impact</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Phase12Page;
