import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Task } from './models'
import * as taskDo from './store/actions/tasks'
import { Store } from './store/models'
import { getId } from './utils'

type TaskListProps = {
  tasks: Task[]
}

const TasksList = ({ tasks }: TaskListProps) => {
  const dispatch = useDispatch()
  return (
    <div>
      {tasks.map(task => {
        const { id, title, description, completed } = task
        const onDelete = _ => dispatch(taskDo.remove(id))
        const onTickComplete = _ => dispatch(taskDo.toggleComplete(id))
        return (
          <div key={id}>
            <span>{id}</span>
            {completed && <b>Completed</b>}
            <h3>{title}</h3>
            <i>{description}</i>
            <br />
            <button onClick={onDelete}>Delete</button>
            &nbsp;|&nbsp;
            <button onClick={onTickComplete}>Complete</button>
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [task, setTask] = useState<Partial<Task>>({ completed: false })
  const tasks = useSelector<Store, Task[]>(state => state.tasks)
  const dispatch = useDispatch()

  const handleCommit = () => {
    console.log(`Commit task:${task}`)
    if (task.title) {
      dispatch(taskDo.create({ ...task, id: getId() } as Task))
    }
  }

  const onChange = (key: 'title' | 'description', value: string) => setTask(prev => ({ ...prev, [key]: value }))

  return (
    <div>
      <h1>Todo app</h1>
      <input type="text" placeholder={'Title'} value={task.title} onChange={e => onChange('title', e.target.value)} />
      <input
        type="text"
        placeholder={'Description'}
        value={task.description}
        onChange={e => onChange('description', e.target.value)}
      />
      <button onClick={handleCommit}>{'>'}</button>

      <TasksList tasks={tasks} />
    </div>
  )
}
