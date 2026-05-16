import { query } from '../db/index.js';

export const checkProjectRole = (requiredRole = 'member') => {
  return async (req, res, next) => {
    try {
      const projectId = req.params.id || req.params.projectId;
      const userId = req.user.id;

      const result = await query(
        'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
        [projectId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied. You are not a member of this project.' });
      }

      const member = result.rows[0];
      req.projectMember = member;

      if (requiredRole === 'admin' && member.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      next();
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Server error during role check.' });
    }
  };
};
