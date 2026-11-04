// parseLLMResponse — shared utility to extract structured data from LLM output
// The LLM sometimes returns a JSON code block inside conditionOverview.
// This handles all variants: fenced JSON, truncated JSON, plain text.

export function parseLLMResponse(rawContent, topLevelData = {}) {
  let {
    conditionOverview = rawContent,
    researchInsights  = [],
    clinicalTrials    = [],
    experts           = [],
    sources           = [],
    freshFetch        = false,
    disclaimers       = [],
    patientTakeaways  = [],
    suggestedQuestions = [],
    trialEligibilitySummary = '',
    chartInsight      = '',
    stats             = null,
  } = topLevelData;

  if (conditionOverview && typeof conditionOverview === 'string') {
    // 1. Strip markdown code fences
    let candidate = conditionOverview
      .replace(/^`{1,3}(?:json)?\s*/im, '')
      .replace(/\s*`{1,3}\s*$/m, '')
      .trim();

    // 2. Find first {
    if (!candidate.startsWith('{')) {
      const idx = candidate.indexOf('{');
      if (idx !== -1) candidate = candidate.slice(idx);
    }

    // 3. Try to parse JSON
    if (candidate.startsWith('{')) {
      let jsonStr = candidate;
      if (!jsonStr.endsWith('}')) {
        const lastBrace = jsonStr.lastIndexOf('}');
        if (lastBrace !== -1) jsonStr = jsonStr.slice(0, lastBrace + 1);
      }

      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed.conditionOverview || parsed.researchInsights || parsed.clinicalTrials) {
          conditionOverview = parsed.conditionOverview || '';
          if (parsed.researchInsights?.length)  researchInsights = parsed.researchInsights;
          if (parsed.clinicalTrials?.length)     clinicalTrials   = parsed.clinicalTrials;
          if (parsed.experts?.length)            experts          = parsed.experts;
          if (!sources?.length && parsed.sources?.length) sources = parsed.sources;
          if (parsed.patientTakeaways?.length)  patientTakeaways  = parsed.patientTakeaways;
          if (parsed.suggestedQuestions?.length) suggestedQuestions = parsed.suggestedQuestions;
          if (parsed.trialEligibilitySummary)   trialEligibilitySummary = parsed.trialEligibilitySummary;
          if (parsed.chartInsight)              chartInsight      = parsed.chartInsight;
          if (parsed.stats)                      stats             = parsed.stats;
        }
      } catch {
        // Try bracket-repair for truncated JSON
        try {
          let fixed = jsonStr;
          fixed = fixed.replace(/,\s*"[^"]*"\s*:\s*"[^"]*$/, '');
          fixed = fixed.replace(/,\s*"[^"]*"\s*:\s*\[[^\]]*$/, '');
          const opens  = (fixed.match(/\[/g) || []).length;
          const closes = (fixed.match(/\]/g) || []).length;
          const openB  = (fixed.match(/\{/g) || []).length;
          const closeB = (fixed.match(/\}/g) || []).length;
          for (let i = 0; i < opens - closes; i++) fixed += ']';
          for (let i = 0; i < openB - closeB; i++) fixed += '}';
          const parsed = JSON.parse(fixed);
          if (parsed.conditionOverview || parsed.researchInsights || parsed.clinicalTrials) {
            conditionOverview = parsed.conditionOverview || '';
            if (parsed.researchInsights?.length)  researchInsights = parsed.researchInsights;
            if (parsed.clinicalTrials?.length)     clinicalTrials   = parsed.clinicalTrials;
            if (parsed.experts?.length)            experts          = parsed.experts;
            if (!sources?.length && parsed.sources?.length) sources = parsed.sources;
            if (parsed.patientTakeaways?.length)  patientTakeaways  = parsed.patientTakeaways;
            if (parsed.suggestedQuestions?.length) suggestedQuestions = parsed.suggestedQuestions;
            if (parsed.trialEligibilitySummary)   trialEligibilitySummary = parsed.trialEligibilitySummary;
            if (parsed.chartInsight)              chartInsight      = parsed.chartInsight;
            if (parsed.stats)                      stats             = parsed.stats;
          }
        } catch {
          // Try regex extraction as a last resort for severely truncated JSON
          const overviewMatch = conditionOverview.match(/"conditionOverview"\s*:\s*"((?:[^"\\]|\\.)*)/);
          if (overviewMatch) {
            try {
              // Unescape the extracted string
              conditionOverview = JSON.parse(`"${overviewMatch[1]}"`);
            } catch {
              conditionOverview = overviewMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
            }
          } else {
            // Not parseable — clean up fences and use as plain text
            conditionOverview = conditionOverview
              .replace(/^`{1,3}(?:json)?\s*/im, '')
              .replace(/\s*`{1,3}\s*$/m, '')
              .trim();
          }
        }
      }
    }
  }

  return {
    text: conditionOverview || '',
    data: { 
      conditionOverview, researchInsights, clinicalTrials, experts, sources, 
      freshFetch, disclaimers, patientTakeaways, suggestedQuestions, 
      trialEligibilitySummary, chartInsight, stats 
    },
  };
}
