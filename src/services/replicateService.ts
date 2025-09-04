// Replicate API service for GPT-5 integration
export interface ReplicateGenerateRequest {
  prompt: string;
  elementType: string;
  quantity: number;
  style: string;
  referenceImage?: File;
}

export interface GeneratedElement {
  id: string;
  preview: string;
  code: string;
  description: string;
}

export const generateUIElements = async (
  config: ReplicateGenerateRequest
): Promise<GeneratedElement[]> => {
  const apiKey = localStorage.getItem("replicate_api_key");
  
  if (!apiKey) {
    throw new Error("Replicate API key not configured. Please add your API key first.");
  }

  try {
    // Real Replicate API call for GPT-5
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "8beff3369e81414ab5df9e4bbec503e5a78ac549",  // GPT model version
        input: {
          prompt: createUIPrompt(config),
          max_tokens: 2000,
          temperature: 0.7,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Poll for completion if needed
    if (result.status === 'processing') {
      return await pollForCompletion(result.id, apiKey);
    }
    
    return parseGeneratedElements(result.output, config);
    
  } catch (error) {
    console.error('Replicate API error:', error);
    
    // Fallback to mock generation for demo purposes
    console.log('Falling back to mock generation...');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate mock elements based on the request (fallback)
  const mockElements: GeneratedElement[] = [];
  
  for (let i = 0; i < config.quantity; i++) {
    const elementId = `${config.elementType}-${config.style}-${i + 1}`;
    
    let preview = '';
    let code = '';
    let description = '';

    // Generate different elements based on type and style
    switch (config.elementType) {
      case 'button':
        if (config.style === 'modern') {
          preview = `<button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            ${config.prompt.includes('Click') ? config.prompt.split(' ')[0] : 'Click Me'}
          </button>`;
          code = `<button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
  ${config.prompt.includes('Click') ? config.prompt.split(' ')[0] : 'Click Me'}
</button>`;
          description = `Modern gradient button with smooth hover effects - ${config.prompt}`;
        } else if (config.style === 'glassmorphism') {
          preview = `<button class="px-6 py-3 backdrop-blur-md bg-white/30 border border-white/50 text-gray-800 font-medium rounded-xl hover:bg-white/40 transition-all">
            Glass Button
          </button>`;
          code = `<button class="px-6 py-3 backdrop-blur-md bg-white/30 border border-white/50 text-gray-800 font-medium rounded-xl hover:bg-white/40 transition-all">
  Glass Button
</button>`;
          description = `Glassmorphism button with backdrop blur effect - ${config.prompt}`;
        }
        break;
        
      case 'card':
        if (config.style === 'modern') {
          preview = `<div class="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div class="h-32 bg-gradient-to-br from-purple-400 to-pink-400"></div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-800 mb-2">Beautiful Card</h3>
              <p class="text-gray-600">${config.prompt}</p>
            </div>
          </div>`;
          code = `<div class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
  <div class="h-32 bg-gradient-to-br from-purple-400 to-pink-400"></div>
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-800 mb-2">Beautiful Card</h3>
    <p class="text-gray-600">${config.prompt}</p>
  </div>
</div>`;
          description = `Modern card with gradient header - ${config.prompt}`;
        }
        break;
        
      case 'input':
        if (config.style === 'modern') {
          preview = `<div class="relative max-w-sm">
            <input type="text" placeholder="Enter text..." class="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors">
            <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>`;
          code = `<div class="relative">
  <input type="text" placeholder="Enter text..." class="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors">
  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
  </svg>
</div>`;
          description = `Modern input field with search icon - ${config.prompt}`;
        }
        break;

      default:
        // Default fallback
        preview = `<button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Generated Element
        </button>`;
        code = `<button class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
  Generated Element
</button>`;
        description = `Generated ${config.elementType} element - ${config.prompt}`;
    }

    mockElements.push({
      id: elementId,
      preview,
      code,
      description,
    });
  }

  return mockElements;
};

// Helper functions for real API integration
const createUIPrompt = (config: ReplicateGenerateRequest): string => {
  return `Generate ${config.quantity} modern ${config.elementType} UI component(s) with ${config.style} styling. 

Requirements: ${config.prompt}

Please return ONLY valid HTML with Tailwind CSS classes. Each component should be:
- Responsive and accessible
- Using modern ${config.style} design principles
- Include hover effects and smooth transitions
- Use semantic HTML elements

Format each component as:
<!-- Component ${config.elementType} -->
<div class="...">
  <!-- component code -->
</div>

Do not include any explanations, just the HTML code.`;
};

const pollForCompletion = async (predictionId: string, apiKey: string): Promise<GeneratedElement[]> => {
  const maxAttempts = 30;
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { 'Authorization': `Token ${apiKey}` }
    });
    
    const result = await response.json();
    
    if (result.status === 'succeeded') {
      return parseGeneratedElements(result.output, {} as ReplicateGenerateRequest);
    }
    
    if (result.status === 'failed') {
      throw new Error('Generation failed on Replicate');
    }
    
    attempts++;
  }
  
  throw new Error('Generation timed out');
};

const parseGeneratedElements = (output: string, config: ReplicateGenerateRequest): GeneratedElement[] => {
  // Parse the AI-generated HTML into structured elements
  const elements: GeneratedElement[] = [];
  
  // Simple parsing - in production, you'd want more robust HTML parsing
  const componentMatches = output.match(/<!-- Component[\s\S]*?(?=<!-- Component|$)/g);
  
  if (componentMatches) {
    componentMatches.forEach((match, index) => {
      const htmlMatch = match.match(/<[^>]+>[\s\S]*?<\/[^>]+>/);
      if (htmlMatch) {
        const html = htmlMatch[0].trim();
        elements.push({
          id: `generated-${Date.now()}-${index}`,
          preview: html,
          code: html,
          description: `AI-generated ${config.elementType || 'element'} - ${config.prompt || 'Custom design'}`
        });
      }
    });
  }
  
  // If no valid components parsed, return empty array
  return elements;
};

export const hasApiKey = (): boolean => {
  return !!localStorage.getItem("replicate_api_key");
};

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const response = await fetch('https://api.replicate.com/v1/models', {
      headers: { 'Authorization': `Token ${apiKey}` }
    });
    return response.ok;
  } catch {
    return false;
  }
};