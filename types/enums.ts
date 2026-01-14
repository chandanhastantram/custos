// User roles - shared between client and server
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUB_ADMIN = 'SUB_ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
}

// Question types
export enum QuestionType {
  KNOWLEDGE = 'Knowledge',
  COMPREHENSION = 'Comprehension',
  APPLICATION = 'Application',
  ANALYSIS = 'Analysis',
  SYNTHESIS = 'Synthesis/Creation',
}

export enum DifficultyLevel {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
}

export enum TestType {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  LESSON_WISE = 'Lesson-wise',
}

// Post types
export enum PostType {
  PHOTO = 'Photo',
  UPLOAD = 'Upload',
  BLOG = 'Blog',
}

// Event types
export enum EventType {
  HOLIDAY = 'Holiday',
  EXAM = 'Exam',
  SPECIAL = 'Special',
}

// Notification types
export enum NotificationType {
  HOMEWORK_REMINDER = 'Homework Reminder',
  TEST_SCORE = 'Test Score',
  ATTENDANCE = 'Attendance',
  EVENT_REMINDER = 'Event Reminder',
  GENERAL = 'General',
}
