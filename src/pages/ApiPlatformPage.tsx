
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const ApiPlatformPage = () => (
  <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-800 via-purple-900 to-black text-white">
    <div className="container mx-auto py-10">
      <Card className="mb-8 bg-purple-900 border-purple-500">
        <CardTitle className="text-3xl p-6 text-white">API Platform & Developer Tools</CardTitle>
        <CardContent>
          <ul className="list-disc ml-6 text-lg text-gray-200 space-y-1">
            <li>Public API: Programmatically analyze death scenarios & scans</li>
            <li>Developer portal: docs, API keys, integrations</li>
            <li>SDKs/libraries for major platforms</li>
            <li>Sample BeatDeath bots and community plugins</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </div>
);
export default ApiPlatformPage;
