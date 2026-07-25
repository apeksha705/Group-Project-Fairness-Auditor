const supabase = require('../config/supabase');

const TABLE = 'projects';

/**
 * Insert a new project row.
 * @param {{ name: string, subject: string, professor_name: string, deadline: string }} fields
 * @returns {{ data: object|null, error: object|null }}
 */
const createProject = async ({ name, subject, professor_name, deadline }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, subject, professor_name, deadline }])
    .select()
    .single();

  return { data, error };
};

/**
 * Fetch all projects, newest first.
 * @returns {{ data: object[]|null, error: object|null }}
 */
const getAllProjects = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

/**
 * Fetch a single project by its UUID.
 * @param {string} id
 * @returns {{ data: object|null, error: object|null }}
 */
const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

module.exports = { createProject, getAllProjects, getProjectById };
