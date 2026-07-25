const supabase = require('../config/supabase');

const TABLE = 'projects';

const createProject = async ({ name, subject, professor_name, deadline }) => {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([{ name, subject, professor_name, deadline }])
    .select()
    .single();

  return { data, error };
};

const getAllProjects = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*');

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);

  return { data, error };
};

const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
};