/**
 * LLM Service
 * Handles all interactions with local LLM (Ollama)
 * Privacy guarantee: All inference happens locally, no external API calls
 */

import axios from 'axios';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GenerateOptions {
  model?: string;
  temperature?: number;
  stream?: boolean;
}

export class LLMService {
  private baseUrl: string = 'http://localhost:11434';
  private defaultModel: string = 'llama3.2:3b';

  /**
   * Generate response from local LLM
   * Privacy: All processing happens on-device
   */
  async generate(
    prompt: string,
    options: GenerateOptions = {}
  ): Promise<string> {
    const model = options.model || this.defaultModel;
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/generate`, {
        model,
        prompt,
        temperature: options.temperature || 0.7,
        stream: false
      });

      return response.data.response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error(
          'Ollama is not running. Please start Ollama: ollama serve'
        );
      }
      throw error;
    }
  }

  /**
   * Chat with conversation history
   * Privacy: Conversation history stays local
   */
  async chat(
    messages: Message[],
    options: GenerateOptions = {}
  ): Promise<string> {
    const model = options.model || this.defaultModel;
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/chat`, {
        model,
        messages,
        stream: false
      });

      return response.data.message.content;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error(
          'Ollama is not running. Please start Ollama: ollama serve'
        );
      }
      throw error;
    }
  }

  /**
   * Stream response from LLM
   * Privacy: Streaming happens locally
   */
  async *streamGenerate(
    prompt: string,
    options: GenerateOptions = {}
  ): AsyncGenerator<string> {
    const model = options.model || this.defaultModel;
    
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/generate`,
        {
          model,
          prompt,
          temperature: options.temperature || 0.7,
          stream: true
        },
        {
          responseType: 'stream'
        }
      );

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n').filter(Boolean);
        for (const line of lines) {
          const data = JSON.parse(line);
          if (data.response) {
            yield data.response;
          }
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error(
          'Ollama is not running. Please start Ollama: ollama serve'
        );
      }
      throw error;
    }
  }

  /**
   * List available local models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/tags`);
      return response.data.models.map((m: any) => m.name);
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ECONNREFUSED') {
        throw new Error(
          'Ollama is not running. Please start Ollama: ollama serve'
        );
      }
      throw error;
    }
  }

  /**
   * Check if Ollama is running
   */
  async isAvailable(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/api/tags`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select best model based on query complexity
   */
  selectModel(query: string, hasGPU: boolean = false): string {
    const isSimple = query.length < 50 && !query.includes('?');
    
    if (isSimple) {
      return 'phi-3-mini'; // Fast, 3.8B params
    } else if (hasGPU) {
      return 'llama3.2:7b'; // Best quality
    }
    
    return this.defaultModel; // Balanced
  }
}

export default new LLMService();