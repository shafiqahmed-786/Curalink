// research.service.js — ingest papers, list papers, get stats
import api from './api';

export const ingestPapers = (query, sources, maxPerSource) =>
  api.post('/research/ingest', { query, sources, maxPerSource });

export const getPapers = (params) =>
  api.get('/research/papers', { params });

export const getStats = () =>
  api.get('/research/stats');
