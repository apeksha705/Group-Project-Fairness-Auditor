const { successResponse, errorResponse } = require('../utils/response');
const { isValidUUID } = require('../utils/validate');
const { createProject, getAllProjects, getProjectById } = require('../services/project.service');

// Fields that must be present and non-empty on POST
const REQUIRED_FIELDS = [
  { key: 'name',           label: 'Project name'  },
  { key: 'subject',        label: 'Subject'        },
  { key: 'professor_name', label: 'Professor name' },
  { key: 'deadline',       label: 'Deadline'       },
];

const getMissingFields = (body) =>
  REQUIRED_FIELDS
    .filter(({ key }) => !body[key] || String(body[key]).trim() === '')
    .map(({ label }) => label);

// ---------------------------------------------------------------------------

/**
 * @desc   Create a new project
 * @route  POST /api/projects
 */
const createProjectHandler = async (req, res) => {
  const missing = getMissingFields(req.body);
  if (missing.length > 0) {
    return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
  }

  const { name, subject, professor_name, deadline } = req.body;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return errorResponse(res, 'deadline must be in YYYY-MM-DD format', 400);
  }

  const { data, error } = await createProject({ name, subject, professor_name, deadline });

  if (error) {
    console.error('[createProject]', error);
    return errorResponse(res, 'Failed to create project', 500);
  }

  return successResponse(res, { data }, 201);
};

/**
 * @desc   Get all projects
 * @route  GET /api/projects
 */
const getAllProjectsHandler = async (req, res) => {
  const { data, error } = await getAllProjects();

  if (error) {
    console.error('[getAllProjects]', error);
    return errorResponse(res, 'Failed to fetch projects', 500);
  }

  return successResponse(res, { data });
};

/**
 * @desc   Get a single project by ID
 * @route  GET /api/projects/:id
 */
const getProjectByIdHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return errorResponse(res, 'Invalid project ID format', 400);
  }

  const { data, error } = await getProjectById(id);

  if (error) {
    if (error.code === 'PGRST116') {
      return errorResponse(res, 'Project not found', 404);
    }
    console.error('[getProjectById]', error);
    return errorResponse(res, 'Failed to fetch project', 500);
  }

  return successResponse(res, { data });
};

module.exports = { createProjectHandler, getAllProjectsHandler, getProjectByIdHandler };
