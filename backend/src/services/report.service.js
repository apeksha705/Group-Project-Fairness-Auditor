const { getProjectById } = require('./project.service');
const { getMembersByProjectId } = require('./member.service');
const { getContributionsByProjectId } = require('./contribution.service');

/**
 * Build a fairness report for a project.
 *
 * Steps:
 *  1. Fetch the project row.
 *  2. Fetch all members for the project.
 *  3. Fetch all contributions for the project.
 *  4. Group contributions by member_id and sum hours / count tasks.
 *  5. Calculate each member's percentage of total hours.
 *
 * Percentage formula:
 *   memberHours / totalHours * 100  (rounded to 2 decimal places)
 *   When totalHours === 0 every member gets 0 %.
 *
 * @param {string} projectId
 * @returns {{
 *   report: {
 *     project:    object,
 *     members:    Array<{ name: string, hours: number, tasks: number, percentage: number }>,
 *     totalHours: number
 *   } | null,
 *   error: { status: number, message: string } | null
 * }}
 */
const buildReport = async (projectId) => {
  // --- 1. Project ---
  const { data: project, error: projectErr } = await getProjectById(projectId);

  if (projectErr) {
    if (projectErr.code === 'PGRST116') {
      return { report: null, error: { status: 404, message: 'Project not found' } };
    }
    console.error('[buildReport] project fetch', projectErr);
    return { report: null, error: { status: 500, message: 'Failed to fetch project' } };
  }

  if (!project) {
    return { report: null, error: { status: 404, message: 'Project not found' } };
  }

  // --- 2. Members ---
  const { data: members, error: membersErr } = await getMembersByProjectId(projectId);

  if (membersErr) {
    console.error('[buildReport] members fetch', membersErr);
    return { report: null, error: { status: 500, message: 'Failed to fetch members' } };
  }

  // --- 3. Contributions ---
  const { data: contributions, error: contribErr } = await getContributionsByProjectId(projectId);

  if (contribErr) {
    console.error('[buildReport] contributions fetch', contribErr);
    return { report: null, error: { status: 500, message: 'Failed to fetch contributions' } };
  }

  // --- 4. Aggregate by member ---
  // Build a lookup: memberId -> { hours, tasks }
  const aggregates = {};

  for (const contribution of contributions) {
    const id = contribution.member_id;
    if (!aggregates[id]) {
      aggregates[id] = { hours: 0, tasks: 0 };
    }
    aggregates[id].hours += parseFloat(contribution.hours_spent) || 0;
    aggregates[id].tasks  += 1;
  }

  // --- 5. Total hours across all members ---
  const totalHours = Object.values(aggregates).reduce((sum, m) => sum + m.hours, 0);

  // --- 6. Build member summary rows (include all members, even those with 0 contributions) ---
  const memberRows = (members || []).map((member) => {
    const agg = aggregates[member.id] || { hours: 0, tasks: 0 };
    const percentage =
      totalHours > 0
        ? Math.round((agg.hours / totalHours) * 100 * 100) / 100  // 2 d.p.
        : 0;

    return {
      name:       member.name,
      hours:      Math.round(agg.hours * 100) / 100,
      tasks:      agg.tasks,
      percentage,
    };
  });

  return {
    report: {
      project:    project,
      members:    memberRows,
      totalHours: Math.round(totalHours * 100) / 100,
    },
    error: null,
  };
};

module.exports = { buildReport };
