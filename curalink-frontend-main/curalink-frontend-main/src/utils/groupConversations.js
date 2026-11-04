// groupConversationsByDate — groups conversations into Today, Yesterday,
// Previous 7 Days, Previous 30 Days, and older month buckets.

export function groupConversationsByDate(conversations) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday - 86400000);
  const startOf7Days = new Date(startOfToday - 86400000 * 7);
  const startOf30Days = new Date(startOfToday - 86400000 * 30);

  const buckets = {
    Today: [],
    Yesterday: [],
    'Previous 7 days': [],
    'Previous 30 days': [],
  };

  const olderBuckets = {}; // keyed by "Month Year"

  for (const conv of conversations) {
    const d = new Date(conv.updatedAt);

    if (d >= startOfToday) {
      buckets['Today'].push(conv);
    } else if (d >= startOfYesterday) {
      buckets['Yesterday'].push(conv);
    } else if (d >= startOf7Days) {
      buckets['Previous 7 days'].push(conv);
    } else if (d >= startOf30Days) {
      buckets['Previous 30 days'].push(conv);
    } else {
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!olderBuckets[label]) olderBuckets[label] = [];
      olderBuckets[label].push(conv);
    }
  }

  const result = [];

  for (const [label, items] of Object.entries(buckets)) {
    if (items.length > 0) result.push({ label, items });
  }

  for (const [label, items] of Object.entries(olderBuckets)) {
    if (items.length > 0) result.push({ label, items });
  }

  return result;
}
