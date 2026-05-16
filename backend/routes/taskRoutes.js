import express from 'express';
import { body } from 'express-validator';
import { checkProjectRole } from '../middleware/projectRoles.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/taskController.js';

// mergeParams is required to access :projectId from the parent router
const router = express.Router({ mergeParams: true });

const taskValidation = [
  body('title').notEmpty().withMessage('Title is required.'),
  body('due_date').optional({ nullable: true }).isISO8601().withMessage('Valid ISO date required.').custom(val => {
    // Custom check for past dates, ignoring time component
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(val);
    if (dueDate < today) {
      throw new Error('Due date cannot be in the past.');
    }
    return true;
  }),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority.'),
  body('status').optional().isIn(['todo', 'in_progress', 'done']).withMessage('Invalid status.')
];

const statusValidation = [
  body('status').notEmpty().isIn(['todo', 'in_progress', 'done']).withMessage('Valid status required.')
];

router.post('/', checkProjectRole('admin'), taskValidation, validateRequest, createTask);
router.get('/', checkProjectRole('member'), getTasks);
router.get('/:taskId', checkProjectRole('member'), getTask);

// updateTask enforces member role here, and the controller restricts what fields can be updated based on role
router.put('/:taskId', checkProjectRole('member'), taskValidation, validateRequest, updateTask);

// patch status is specifically for members on their own tasks (or admins)
router.patch('/:taskId/status', checkProjectRole('member'), statusValidation, validateRequest, updateTaskStatus);

router.delete('/:taskId', checkProjectRole('admin'), deleteTask);

export default router;
