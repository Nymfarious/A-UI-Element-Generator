import { useState } from "react";
import { Upload, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface PromptPanelProps {
  onGenerate: (config: GenerateConfig) => void;
  isLoading: boolean;
}

export interface GenerateConfig {
  prompt: string;
  elementType: string;
  quantity: number;
  style: string;
  referenceImage?: File;
}

const PromptPanel = ({ onGenerate, isLoading }: PromptPanelProps) => {
  const [prompt, setPrompt] = useState("");
  const [elementType, setElementType] = useState("button");
  const [quantity, setQuantity] = useState([3]);
  const [style, setStyle] = useState("modern");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    onGenerate({
      prompt: prompt.trim(),
      elementType,
      quantity: quantity[0],
      style,
      referenceImage: referenceImage || undefined,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      setReferenceImage(file);
    }
  };

  const removeImage = () => {
    setReferenceImage(null);
  };

  const styleOptions = [
    { value: "modern", label: "Modern" },
    { value: "minimal", label: "Minimal" },
    { value: "glassmorphism", label: "Glass" },
    { value: "neomorphism", label: "Soft UI" },
  ];

  return (
    <Card className="card-ai sticky top-24 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Generate UI Elements
        </h2>
      </div>

      <div className="space-y-6">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your UI element
          </label>
          <Textarea
            placeholder="e.g., Modern gradient button with hover effects"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="input-ai resize-none"
            rows={3}
          />
        </div>

        {/* Element Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Element Type
          </label>
          <Select value={elementType} onValueChange={setElementType}>
            <SelectTrigger className="input-ai">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="button">Button</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="input">Input Field</SelectItem>
              <SelectItem value="badge">Badge</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
              <SelectItem value="toggle">Toggle Switch</SelectItem>
              <SelectItem value="mixed">Mixed (Random)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of variations: 
            <span className="text-purple-600 font-semibold ml-1">
              {quantity[0]}
            </span>
          </label>
          <Slider
            value={quantity}
            onValueChange={setQuantity}
            max={8}
            min={1}
            step={1}
            className="w-full"
          />
        </div>

        {/* Style Preset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style Preset
          </label>
          <div className="grid grid-cols-2 gap-2">
            {styleOptions.map((option) => (
              <Button
                key={option.value}
                variant={style === option.value ? "default" : "outline"}
                onClick={() => setStyle(option.value)}
                className={`text-sm ${
                  style === option.value 
                    ? "btn-ai-primary" 
                    : "btn-ai-secondary"
                }`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reference Image (Optional)
          </label>
          {!referenceImage ? (
            <div
              onClick={() => document.getElementById('image-upload')?.click()}
              className="card-glass border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </div>
          ) : (
            <div className="card-glass p-3 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">
                  {referenceImage.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isLoading}
          className="btn-ai-primary w-full py-3"
        >
          <div className="flex items-center justify-center">
            <Sparkles className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Generating...' : 'Generate Elements'}
          </div>
        </Button>
      </div>
    </Card>
  );
};

export default PromptPanel;