/* =========================================================
   WORKLENS — SAMPLE DATA
   No backend: this file supplies the illustrative sample
   dataset that powers the demo report end-to-end.
========================================================= */
const sampleData = {
    members: ['Aisha', 'Marcus', 'Priya', 'Jordan'],
    memberColors: ['#2DD4BF', '#4FD1E8', '#F5A524', '#F0576B'],
    heroContribution: [
      { name: 'Aisha',  pct: 88, status: 'On track' },
      { name: 'Marcus', pct: 74, status: 'On track' },
      { name: 'Priya',  pct: 91, status: 'On track' },
      { name: 'Jordan', pct: 32, status: 'Flagged' }
    ],
    commitShare: [34, 26, 30, 10],
    docsTaskShare: [22, 24, 33, 8],
    contributionProfile: {
      labels: ['Contribution Confidence', 'Participation Index', 'Project Health', 'Team Activity'],
      values: [0.91, 0.76, 0.88, 0.62]
    },
    trend: { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5 (current)'], values: [58, 64, 69, 71, 78] },
    overallScore: 78
  };
