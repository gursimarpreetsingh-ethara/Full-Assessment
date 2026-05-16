import { query } from '../db/index.js';

export const getDashboardStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Total tasks assigned to user across all projects
    // 2. Tasks grouped by status
    // 3. Overdue tasks
    const tasksResult = await query(`
      SELECT t.id, t.status, t.due_date, p.name as project_name 
      FROM tasks t
      JOIN project_members pm ON t.project_id = pm.project_id
      JOIN projects p ON p.id = t.project_id
      WHERE t.assigned_to = $1 AND pm.user_id = $1
    `, [userId]);

    const tasks = tasksResult.rows;

    let totalTasks = tasks.length;
    let statusCounts = { todo: 0, in_progress: 0, done: 0 };
    let overdueCount = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
      if (statusCounts[task.status] !== undefined) {
        statusCounts[task.status]++;
      }
      
      if (task.due_date && task.status !== 'done') {
        const dueDate = new Date(task.due_date);
        if (dueDate < today) {
          overdueCount++;
        }
      }
    });

    // 4. Tasks per project summary (for projects the user is a member of)
    const projectSummaryResult = await query(`
      SELECT p.id, p.name, 
             COUNT(t.id) as total_tasks,
             SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed_tasks
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE pm.user_id = $1
      GROUP BY p.id, p.name
    `, [userId]);

    // 5. Tasks per user (across projects the user has access to)
    const tasksPerUserResult = await query(`
      SELECT u.id, u.name, COUNT(t.id) as task_count
      FROM users u
      JOIN tasks t ON u.id = t.assigned_to
      JOIN projects p ON t.project_id = p.id
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = $1
      GROUP BY u.id, u.name
      ORDER BY task_count DESC
    `, [userId]);

    res.json({
      totalTasks,
      statusCounts,
      overdueCount,
      projectSummary: projectSummaryResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        totalTasks: parseInt(row.total_tasks) || 0,
        completedTasks: parseInt(row.completed_tasks) || 0
      })),
      tasksPerUser: tasksPerUserResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        taskCount: parseInt(row.task_count) || 0
      }))
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error fetching dashboard stats.' });
  }
};
