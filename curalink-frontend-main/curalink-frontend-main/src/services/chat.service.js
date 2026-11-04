// chat.service.js — calls POST /api/ask and GET /api/conversations/:sessionId
import api from './api';

export const askQuestion = (payload, sessionId) =>
  api.post('/ask', {
    query:       payload.query,
    disease:     payload.disease,
    patientName: payload.patientName,
    location:    payload.location,
    displayText: payload.displayText,
    source:      payload.source,      // 'All Sources' | 'PubMed' | 'OpenAlex' | 'ClinicalTrials' | 'Uploaded PDFs'
    sessionId,
  });

export const getConversation = (sessionId) =>
  api.get(`/conversations/${sessionId}`);
