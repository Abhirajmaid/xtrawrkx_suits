/**
 * Home Components Export File
 * 
 * This file exports all home page components for easy importing.
 * It follows the barrel export pattern for clean imports throughout the application.
 * 
 * Usage:
 * import { Header, StatsCards, AssignedTasksTable, ProjectsTable, People, PrivateNotepad, RecentActivity } from './components';
 * 
 * Components:
 * - Header: Page header with title, search, and user actions
 * - StatsCards: Dashboard statistics cards showing key metrics
 * - AssignedTasksTable: Table of tasks assigned to current user
 * - ProjectsTable: Table of active projects with status indicators
 * - People: Team members and collaborators list
 * - PrivateNotepad: Personal note-taking area with formatting tools
 * - RecentActivity: Recent activity feed
 */

export { default as Header } from './Header';
export { default as StatsCards } from './StatsCards';
export { default as AssignedTasksTable } from './AssignedTasksTable';
export { default as ProjectsTable } from './ProjectsTable';
export { default as People } from './People';
export { default as PrivateNotepad } from './PrivateNotepad';
export { default as RecentActivity } from './RecentActivity';
