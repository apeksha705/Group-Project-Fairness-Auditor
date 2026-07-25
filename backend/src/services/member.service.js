const supabase = require('../config/supabase');

const TABLE = 'members';

/**
 * Insert a new member row linked to a project.
 * @param {{ project_id: string, name: string }} fields
 * @returns {{ data: object|null, error: object|null }}
 */
const createMember = async ({ project_id, name }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ project_id, name }])
    .select()
    .single();

  return { data, error };
};

/**
 * Fetch all members belonging to a project, oldest first.
 * @param {string} project_id
 * @returns {{ data: object[]|null, error: object|null }}
 */
const getMembersByProjectId = async (project_id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('project_id', project_id)
    .order('created_at', { ascending: true });

  return { data, error };
};

/**
 * Fetch a single member by its UUID.
 * @param {string} id
 * @returns {{ data: object|null, error: object|null }}
 */
const getMemberById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

module.exports = { createMember, getMembersByProjectId, getMemberById };
