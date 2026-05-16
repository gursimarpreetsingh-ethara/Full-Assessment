import { query } from '../db/index.js';

// create a project
export const createProject = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    await query('BEGIN'); // Start transaction

    const projResult = await query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description, userId]
    );
    const project = projResult.rows[0];

    await query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [project.id, userId, 'admin']
    );

    await query('COMMIT');

    res.status(201).json({ project });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Server error creating project.' });
  }
};

// get user's projects
export const getProjects = async (req, res) => {
  try {
    const result = await query(`
      SELECT p.*, pm.role 
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = $1
    `, [req.user.id]);
    res.json({ projects: result.rows });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Server error fetching projects.' });
  }
};

// get single project
export const getProject = async (req, res) => {
  try {
    const projResult = await query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (projResult.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const membersResult = await query(`
      SELECT u.id, u.name, u.email, pm.role, pm.joined_at 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `, [req.params.id]);

    const project = projResult.rows[0];
    project.members = membersResult.rows;

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Server error fetching project.' });
  }
};

// update project
export const updateProject = async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await query(
      'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, req.params.id]
    );
    res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Server error updating project.' });
  }
};

// delete project
export const deleteProject = async (req, res) => {
  try {
    // ON DELETE CASCADE handles tasks and members
    await query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Server error deleting project.' });
  }
};

// add member
export const addMember = async (req, res) => {
  const { email, role = 'member' } = req.body;
  const projectId = req.params.id;

  try {
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const userIdToAdd = userResult.rows[0].id;

    const checkMember = await query('SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userIdToAdd]);
    if (checkMember.rows.length > 0) {
      return res.status(409).json({ error: 'User is already a member.' });
    }

    await query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [projectId, userIdToAdd, role]
    );

    res.status(201).json({ message: 'Member added successfully.' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Server error adding member.' });
  }
};

// remove member
export const removeMember = async (req, res) => {
  const projectId = req.params.id;
  const userIdToRemove = req.params.userId;

  try {
    if (req.user.id.toString() === userIdToRemove.toString()) {
      const adminCount = await query(
        'SELECT COUNT(*) FROM project_members WHERE project_id = $1 AND role = $2',
        [projectId, 'admin']
      );
      if (parseInt(adminCount.rows[0].count) <= 1) {
        return res.status(400).json({ error: 'Cannot remove yourself as you are the last admin.' });
      }
    }

    await query('DELETE FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, userIdToRemove]);
    res.json({ message: 'Member removed successfully.' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Server error removing member.' });
  }
};

// get members
export const getMembers = async (req, res) => {
  const projectId = req.params.id;
  try {
    const membersResult = await query(`
      SELECT u.id, u.name, u.email, pm.role, pm.joined_at 
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `, [projectId]);
    res.json({ members: membersResult.rows });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Server error fetching members.' });
  }
};
