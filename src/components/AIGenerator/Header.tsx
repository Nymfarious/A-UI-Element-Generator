import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onClearAll: () => void;
}

const Header = ({ onClearAll }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">
                AI UI Generator
              </h1>
              <p className="text-sm text-muted-foreground">
                Powered by GPT-5
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClearAll}
            className="btn-ai-ghost"
          >
            Clear All
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;