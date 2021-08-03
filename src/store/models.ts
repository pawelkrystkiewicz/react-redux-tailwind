import { Task } from '../models'

export type Store = {
  tasks: Task[]
}

export enum TaskActionKey {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  TOGGLE_COMPLETE = 'TOGGLE_COMPLETE',
}

export interface TaskCreate {
  type: TaskActionKey.CREATE
  payload: { task: Task }
}

export interface TaskEdit {
  type: TaskActionKey.EDIT
  payload: { task: Task }
}

export interface TaskDelete {
  type: TaskActionKey.DELETE
  payload: { id: number }
}

export interface TaskToggleComplete {
  type: TaskActionKey.TOGGLE_COMPLETE
  payload: { id: number }
}

export type TaskAction = TaskCreate | TaskEdit | TaskDelete | TaskToggleComplete
