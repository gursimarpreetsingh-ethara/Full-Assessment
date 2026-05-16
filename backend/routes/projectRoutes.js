import express from 'express';
import { body } from 'express-validator';
import { authMiddleware } from '../middleware/auth.js';
import { checkProjectRole } from '../middleware/projectRoles.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers
} from '../controllers/projectController.js';
import taskRoutes from './taskRoutes.js';

const router = express.Router();

// Require authentication for all project routes
router.use(authMiddleware);

// Validation
const projectValidation = [
  body('name').notEmpty().withMessage('Project name is required.')
];

const memberValidation = [
  body('email').isEmail().withMessage('Valid email is required.')
];

// Routes
router.post('/', projectValidation, validateRequest, createProject);
router.get('/', getProjects);

router.get('/:id', checkProjectRole('member'), getProject);
router.put('/:id', checkProjectRole('admin'), projectValidation, validateRequest, updateProject);
router.delete('/:id', checkProjectRole('admin'), deleteProject);

router.post('/:id/members', checkProjectRole('admin'), memberValidation, validateRequest, addMember);
router.delete('/:id/members/:userId', checkProjectRole('admin'), removeMember);
router.get('/:id/members', checkProjectRole('member'), getMembers);

// Mount task routes
router.use('/:projectId/tasks', taskRoutes);

export default router;
