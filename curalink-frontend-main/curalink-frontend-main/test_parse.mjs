import { parseLLMResponse } from './src/utils/parseLLMResponse.js';

const rawLLM = JSON.stringify({
  conditionOverview: "Hello",
  sources: [{ title: "LLM Title", url: "llm.com" }]
});

const backendSources = [{ title: "Backend Title", rankingScore: 0.99, rankingBreakdown: {} }];

const result = parseLLMResponse(rawLLM, {
  conditionOverview: rawLLM,
  sources: backendSources
});

console.log("Returned sources:", result.data.sources);
