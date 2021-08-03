import { Task } from '../../models'
import { TaskAction, TaskActionKey } from '../models'
import { findById, removeFromListById, sortById } from '../../utils'

export default function tasksReducer(state: Task[] = [], action: TaskAction): Task[] {
  switch (action.type) {
    case TaskActionKey.CREATE:
      return [...state, action.payload.task].sort(sortById)

    case TaskActionKey.EDIT:
      const editedTask = findById<Task>(action.payload.task.id, state)
      const tasksWithoutEdited = removeFromListById<Task>(action.payload.task.id, state)
      return [...(!editedTask ? tasksWithoutEdited : [...tasksWithoutEdited, { ...editedTask, ...action.payload.task }])].sort(sortById)

    case TaskActionKey.DELETE:
      return removeFromListById<Task>(action.payload.id, state).sort(sortById)

    case TaskActionKey.TOGGLE_COMPLETE:
      const task = findById<Task>(action.payload.id, state)
      const newState = removeFromListById<Task>(action.payload.id, state)
      return [...(!task ? newState : [...newState, { ...task, completed: !task.completed }])].sort(sortById)
    default:
      return state
  }
}
