// formatters.js — date formatting, truncation, source label helpers

export const formatYear = (year) => year || 'Unknown year';

export const truncate = (str, maxLength = 120) =>
  str?.length > maxLength ? `${str.slice(0, maxLength)}...` : str;

export const sourceLabel = (source) => {
  const labels = {
    pubmed: 'PubMed',
    openalex: 'OpenAlex',
    clinicaltrials: 'ClinicalTrials.gov',
    pdf: 'Uploaded PDF',
  };
  return labels[source] || source;
};
