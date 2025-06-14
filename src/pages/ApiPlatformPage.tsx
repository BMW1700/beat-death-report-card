
import { Card } from "@/components/ui/card";

// Professional API Platform Page, styled after reference image
const ApiPlatformPage = () => (
  <div className="min-h-screen pt-16 bg-gradient-to-br from-[#211d3e] via-[#662d91] to-[#241b3b] flex items-center justify-center">
    <div className="max-w-3xl w-full px-4">
      <div className="rounded-2xl border-2 border-purple-300 shadow-2xl bg-gradient-to-br from-purple-700 via-purple-800 to-purple-900/90 p-10 sm:p-12" style={{ backdropFilter: "blur(8px)" }}>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-white mb-6 tracking-tight">API Platform &amp; Developer Tools</h1>
        <ul className="list-disc pl-6 space-y-3 text-lg sm:text-xl text-purple-100 font-medium">
          <li>
            <span className="font-semibold text-white">Public API:</span> Programmatically analyze death scenarios &amp; scans
          </li>
          <li>
            <span className="font-semibold text-white">Developer portal:</span> Docs, API keys, integrations
          </li>
          <li>
            <span className="font-semibold text-white">SDKs/libraries:</span> For major platforms
          </li>
          <li>
            <span className="font-semibold text-white">Sample BeatDeath bots &amp; plugins:</span> Try and build community integrations
          </li>
        </ul>
        <div className="mt-8 space-y-4">
          <div className="bg-purple-900/60 border border-purple-500/40 rounded-lg px-6 py-4">
            <div className="text-white text-lg font-bold mb-1">Coming soon:</div>
            <ul className="list-disc pl-5 text-purple-200 text-base space-y-1">
              <li>Auto-generated API docs (OpenAPI/Swagger)</li>
              <li>Easy developer onboarding</li>
              <li>Sandbox for test scans & scenario queries</li>
              <li>Marketplace for open-source plugins</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApiPlatformPage;

