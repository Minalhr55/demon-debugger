import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Demon } from './src/types';

// Mock serverless function behavior in Vite for the /api/summon endpoint
const aiSummonPlugin = () => ({
  name: 'ai-summon-api',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/summon' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { language } = JSON.parse(body);
            const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

            if (!apiKey || apiKey === 'your_api_key_here') {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: "API Key missing or invalid on server." }));
              return;
            }

            // In a production environment, this would be a real POST to:
            // https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}
            // Here we simulate the logic of calling Gemini and getting a structured JSON response.
            
            // Simulating AI generation delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const mockAiResponse = {
              id: `ai-${Math.random().toString(36).substr(2, 9)}`,
              name: "Void Pointer Wraith",
              title: "Eater of Unallocated Souls",
              bugCategory: "Memory",
              difficulty: "medium",
              language: language,
              spriteId: "demon_ai_generic.png",
              codeSnippet: language === 'c' ? "int *p;\n*p = 10;" : "let x;\nconsole.log(x.value);",
              buggyLineIndex: 1,
              options: [
                { id: "opt-1", text: "Allocate memory before use" },
                { id: "opt-2", text: "Declare as a constant" },
                { id: "opt-3", text: "Ignore the warning" }
              ],
              correctOptionId: "opt-1",
              terminalAnswer: "Success",
              simulationFailOutput: "Segmentation Fault (core dumped)",
              simulationPassOutput: "Memory Stabilized.",
              explanation: "The pointer was dereferenced before pointing to a valid memory address.",
              lore: "It haunts the unmapped regions of the heap, waiting for a stray reference.",
              points: 20
            };

            // STRICT VALIDATION: Check that the returned object contains all required Demon fields
            const requiredFields: (keyof Demon)[] = [
              'id', 'name', 'title', 'bugCategory', 'difficulty', 'language', 
              'spriteId', 'codeSnippet', 'buggyLineIndex', 'options', 
              'correctOptionId', 'terminalAnswer', 'simulationFailOutput', 
              'simulationPassOutput', 'explanation', 'lore', 'points'
            ];

            const missingFields = requiredFields.filter(field => !(field in mockAiResponse));

            if (missingFields.length > 0) {
              throw new Error(`AI generated an incomplete demon. Missing: ${missingFields.join(', ')}`);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(mockAiResponse));
          } catch (err: any) {
            console.error(`[Server API Error]: ${err.message}`);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              error: "Internal Summoning Error", 
              details: err.message 
            }));
          }
        });
      } else {
        next();
      }
    });
  }
});

export default defineConfig({
  plugins: [react(), aiSummonPlugin()],
  server: {
    port: 3000,
    strictPort: true
  }
});