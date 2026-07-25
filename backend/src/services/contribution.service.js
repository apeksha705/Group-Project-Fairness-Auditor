const supabase = require('../config/supabase');

const TABLE = 'contributions';

/**
 * Insert a new contribution row.
 * @param {{
 *   project_id:    string,
 *   member_id:     string,
 *   task_title:    string,
 *   description:   string|undefined,
 *   task_category: string|undefined,
 *   hours_spent:   number
 * }} fields
 * @returns {{ data: object|null, error: object|null }}
 */
const createContribution = async ({
  project_id,
  member_id,
  task_title,
  description,
  task_category,
  hours_spent,
}) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ project_id, member_id, task_title, description, task_category, hours_spent }])
    .select()
    .single();

  return { data, error };
};

/**
 * Fetch all contributions for a project, newest first.
 * Joins member name so callers don't need a second query.
 * @param {string} project_id
 * @returns {{ data: object[]|null, error: object|null }}
 */
const getContributionsByProjectId = async (project_id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      members (
        id,
        name
      )
    `)
    .eq('project_id', project_id)
    .order('created_at', { ascending: false });

  return { data, error };
};

module.exports = { createContribution, getContributionsByProjectId };
