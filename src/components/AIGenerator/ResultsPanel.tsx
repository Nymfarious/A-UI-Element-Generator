import { useState } from "react";
import { Copy, Check, Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface GeneratedElement {
  id: string;
  preview: string;
  code: string;
  description: string;
}

interface ResultsPanelProps {
  elements: GeneratedElement[];
  isLoading: boolean;
}

const ResultsPanel = ({ elements, isLoading }: ResultsPanelProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  if (isLoading) {
    return (
      <Card className="card-ai p-12 text-center">
        <div className="inline-block animate-spin-slow mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse-glow"></div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Generating your UI elements...
        </h3>
        <p className="text-sm text-gray-500">
          GPT-5 is crafting beautiful components for you
        </p>
      </Card>
    );
  }

  if (elements.length === 0) {
    return (
      <Card className="card-ai p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Code className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No elements generated yet
        </h3>
        <p className="text-gray-500">
          Enter a prompt and click generate to create UI elements
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Generated Elements ({elements.length})
        </h3>
      </div>

      <div className="grid gap-6">
        {elements.map((element) => (
          <Card key={element.id} className="card-ai overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm text-gray-600 flex-1">
                  {element.description}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(element.code, element.id)}
                  className="ml-2 flex-shrink-0"
                >
                  {copiedId === element.id ? (
                    <>
                      <Check className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview" className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center">
                    <Code className="w-4 h-4 mr-1" />
                    Code
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-4">
                  <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 min-h-[120px] flex items-center justify-center">
                    <div
                      dangerouslySetInnerHTML={{ __html: element.preview }}
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="code" className="mt-4">
                  <div className="code-block overflow-x-auto">
                    <pre className="text-sm">
                      <code>{element.code}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResultsPanel;