import { useState, useEffect } from "react";
import { Key, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeySetupProps {
  onKeyConfigured: (hasKey: boolean) => void;
}

const ApiKeySetup = ({ onKeyConfigured }: ApiKeySetupProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("replicate_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsConfigured(true);
      onKeyConfigured(true);
    }
  }, [onKeyConfigured]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("replicate_api_key", apiKey.trim());
      setIsConfigured(true);
      onKeyConfigured(true);
    }
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("replicate_api_key");
    setApiKey("");
    setIsConfigured(false);
    onKeyConfigured(false);
  };

  if (isConfigured) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <Key className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="flex items-center justify-between">
            <span>Replicate API key configured</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveKey}
              className="text-green-600 hover:text-green-800"
            >
              Remove
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="card-ai p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Configure Replicate API Key
        </h3>
      </div>

      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <p>Your API key is stored locally in your browser and never sent to our servers.</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">For better security, consider </span>
              <Button
                variant="link"
                size="sm"
                className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                connecting to Supabase
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Replicate API Key
          </label>
          <div className="relative">
            <Input
              type={showKey ? "text" : "password"}
              placeholder="r8_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="input-ai pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSaveKey}
          disabled={!apiKey.trim()}
          className="btn-ai-primary w-full"
        >
          Save API Key
        </Button>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Get your API key from <a href="https://replicate.com/account/api-tokens" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Replicate Dashboard</a></p>
          <p>• Your key is encrypted and stored only in your browser</p>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeySetup;