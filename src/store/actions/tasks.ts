import { TaskActionKey, TaskEdit, TaskToggleComplete, TaskDelete, TaskCreate } from "../models"
import { Task } from "../../models"

export const edit = (task: Task): TaskEdit => {
  return {
    type: TaskActionKey.EDIT,
    payload: { task },
  }
}
export const toggleComplete = (id: number): TaskToggleComplete => {
  return {
    type: TaskActionKey.TOGGLE_COMPLETE,
    payload: { id },
  }
}
export const remove = (id: number): TaskDelete => {
  return {
    type: TaskActionKey.DELETE,
    payload: { id },
  }
}

export const create = (task: Task): TaskCreate => {
  return {
    type: TaskActionKey.CREATE,
    payload: { task },
  }
}
