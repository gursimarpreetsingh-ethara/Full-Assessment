import { query } from '../db/index.js';

const checkAssigneeMember = async (projectId, assigneeId) => {
  if (!assigneeId) return true;
  const result = await query('SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2', [projectId, assigneeId]);
  return result.rows.length > 0;
};

export const createTask = async (req, res) => {
  const { title, description, due_date, priority = 'medium', assigned_to } = req.body;
  const projectId = req.params.projectId;
  const userId = req.user.id;

  try {
    if (assigned_to) {
      const isMember = await checkAssigneeMember(projectId, assigned_to);
      if (!isMember) return res.status(400).json({ error: 'Assigned user must be a member of the project.' });
    }

    const result = await query(
      `INSERT INTO tasks (project_id, title, description, due_date, priority, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [projectId, title, description, due_date || null, priority, assigned_to || null, userId]
    );

    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error creating task.' });
  }
};

export const getTasks = async (req, res) => {
  const projectId = req.params.projectId;
  const { status, assigned_to, priority } = req.query;

  try {
    let sql = `
      SELECT t.*, u.name as assignee_name, u.email as assignee_email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = $1
    `;
    const params = [projectId];
    let paramIndex = 2;

    if (status) {
      sql += ` AND t.status = $${paramIndex++}`;
      params.push(status);
    }
    if (assigned_to) {
      sql += ` AND t.assigned_to = $${paramIndex++}`;
      params.push(assigned_to);
    }
    if (priority) {
      sql += ` AND t.priority = $${paramIndex++}`;
      params.push(priority);
    }

    sql += ' ORDER BY t.created_at DESC';

    const result = await query(sql, params);
    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error fetching tasks.' });
  }
};

export const getTask = async (req, res) => {
  try {
    const result = await query(`
      SELECT t.*, u.name as assignee_name, u.email as assignee_email
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = $1 AND t.project_id = $2
    `, [req.params.taskId, req.params.projectId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Server error fetching task.' });
  }
};

export const updateTask = async (req, res) => {
  const { title, description, due_date, priority, assigned_to, status } = req.body;
  const { projectId, taskId } = req.params;

  try {
    const taskResult = await query('SELECT * FROM tasks WHERE id = $1 AND project_id = $2', [taskId, projectId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found.' });
    
    const task = taskResult.rows[0];
    const memberRole = req.projectMember.role;
    
    // Member authorization check
    if (memberRole !== 'admin') {
      if (task.assigned_to !== req.user.id) {
        return res.status(403).json({ error: 'Members can only update tasks assigned to them.' });
      }
      // Members can only update status
      if (title !== undefined || description !== undefined || due_date !== undefined || priority !== undefined || assigned_to !== undefined) {
        return res.status(403).json({ error: 'Members can only update the status of their assigned tasks.' });
      }
    }

    if (assigned_to) {
      const isMember = await checkAssigneeMember(projectId, assigned_to);
      if (!isMember) return res.status(400).json({ error: 'Assigned user must be a member of the project.' });
    }

    const newTitle = title !== undefined ? title : task.title;
    const newDesc = description !== undefined ? description : task.description;
    const newDue = due_date !== undefined ? due_date : task.due_date;
    const newPrio = priority !== undefined ? priority : task.priority;
    const newAssigned = assigned_to !== undefined ? assigned_to : task.assigned_to;
    const newStatus = status !== undefined ? status : task.status;

    const result = await query(`
      UPDATE tasks 
      SET title = $1, description = $2, due_date = $3, priority = $4, assigned_to = $5, status = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 RETURNING *
    `, [newTitle, newDesc, newDue, newPrio, newAssigned, newStatus, taskId]);

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error updating task.' });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const { projectId, taskId } = req.params;

  try {
    const taskResult = await query('SELECT * FROM tasks WHERE id = $1 AND project_id = $2', [taskId, projectId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found.' });
    
    const task = taskResult.rows[0];
    const memberRole = req.projectMember.role;

    if (memberRole !== 'admin' && task.assigned_to !== req.user.id) {
      return res.status(403).json({ error: 'You can only update the status of your own tasks.' });
    }

    const result = await query(`
      UPDATE tasks 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 RETURNING *
    `, [status, taskId]);

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ error: 'Server error updating task status.' });
  }
};

export const deleteTask = async (req, res) => {
  const { projectId, taskId } = req.params;
  try {
    await query('DELETE FROM tasks WHERE id = $1 AND project_id = $2', [taskId, projectId]);
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error deleting task.' });
  }
};
