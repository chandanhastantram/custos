import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
  role: z.enum(['SUPER_ADMIN', 'SUB_ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
  rollNumber: z.string().optional(),
  class: z.string().optional(),
  section: z.string().optional(),
  parentName: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal('')),
  parentPhone: z.string().optional(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
});

// Assignment validation schemas
export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  subject: z.string().min(2).max(100),
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/, 'Invalid class format'),
  section: z.string().max(10).optional(),
  dueDate: z.string().datetime('Invalid date format'),
  totalMarks: z.number().min(1).max(1000),
  attachments: z.array(z.string().url()).optional(),
  instructions: z.string().max(2000).optional(),
  allowLateSubmission: z.boolean().optional(),
  lateSubmissionPenalty: z.number().min(0).max(100).optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial().extend({
  assignmentId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid assignment ID'),
});

// Test validation schemas
export const createTestSchema = z.object({
  title: z.string().min(3).max(200),
  subject: z.string().min(2).max(100),
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/),
  section: z.string().max(10).optional(),
  weakTopics: z.array(z.string()).min(1, 'At least one weak topic required'),
  strongTopics: z.array(z.string()).min(1, 'At least one strong topic required'),
  questionCount: z.number().min(1).max(100),
  duration: z.number().min(5).max(300),
  scheduledDate: z.string().datetime().optional(),
  testType: z.enum(['Daily', 'Weekly', 'Monthly', 'Exam']).optional(),
});

// Submission validation schemas
export const createSubmissionSchema = z.object({
  assignmentId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  testId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  answers: z.array(z.object({
    questionId: z.string(),
    questionText: z.string(),
    studentAnswer: z.string().max(10000),
    maxMarks: z.number().optional(),
  })).min(1),
  attachments: z.array(z.string().url()).optional(),
});

export const gradeSubmissionSchema = z.object({
  marksObtained: z.number().min(0),
  feedback: z.string().max(2000).optional(),
  answerGrades: z.array(z.object({
    questionId: z.string(),
    marksObtained: z.number().min(0),
  })).optional(),
});

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().max(200).optional(),
});

export const classFilterSchema = z.object({
  class: z.string().regex(/^[0-9]{1,2}[A-Z]?$/).optional(),
  section: z.string().max(10).optional(),
  subject: z.string().max(100).optional(),
});
