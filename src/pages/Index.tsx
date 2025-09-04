import { useState } from "react";
import Header from "@/components/AIGenerator/Header";
import PromptPanel, { GenerateConfig } from "@/components/AIGenerator/PromptPanel";
import ResultsPanel from "@/components/AIGenerator/ResultsPanel";
import { generateUIElements, GeneratedElement } from "@/services/replicateService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [elements, setElements] = useState<GeneratedElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (config: GenerateConfig) => {
    setIsLoading(true);
    try {
      const generatedElements = await generateUIElements(config);
      setElements(prev => [...generatedElements, ...prev]);
      
      toast({
        title: "Elements Generated!",
        description: `Generated ${generatedElements.length} UI elements successfully.`,
      });
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your UI elements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setElements([]);
    toast({
      title: "Cleared",
      description: "All generated elements have been cleared.",
    });
  };

  return (
    <div className="min-h-screen">
      <Header onClearAll={handleClearAll} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-1">
            <PromptPanel 
              onGenerate={handleGenerate} 
              isLoading={isLoading} 
            />
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2">
            <ResultsPanel 
              elements={elements}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
