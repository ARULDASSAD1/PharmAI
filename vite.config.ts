import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import {GoogleGenAI} from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', async () => {
          let parsedBody: any = {};
          try {
            if (body) parsedBody = JSON.parse(body);
          } catch (e) {
            // ignore
          }

          res.setHeader('Content-Type', 'application/json');
          const apiKey = process.env.GEMINI_API_KEY;

          if (req.url === '/api/gemini/generate') {
            if (!apiKey) {
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: false,
                  error:
                    'GEMINI_API_KEY environment variable is missing. Please configure it in Settings > Secrets.',
                  result: null,
                })
              );
              return;
            }

            try {
              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              const {prompt, systemInstruction, temperature, jsonMode} =
                parsedBody;

              const config: any = {};
              if (systemInstruction) config.systemInstruction = systemInstruction;
              if (temperature !== undefined) config.temperature = Number(temperature);
              if (jsonMode) config.responseMimeType = 'application/json';

              const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt || 'Hello Gemini',
                config: Object.keys(config).length > 0 ? config : undefined,
              });

              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  result: response.text,
                  model: 'gemini-3.6-flash',
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  success: false,
                  error: err.message || 'Failed to call Gemini API',
                })
              );
            }
            return;
          }

          if (req.url === '/api/gemini/status') {
            res.statusCode = 200;
            res.end(
              JSON.stringify({
                hasKey: !!apiKey,
                model: 'gemini-3.6-flash',
              })
            );
            return;
          }

          res.statusCode = 404;
          res.end(JSON.stringify({error: 'Endpoint not found'}));
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
