import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Task } from './models'
import * as taskDo from './store/actions/tasks'
import { Store } from './store/models'
import { getId } from './utils'

import videos from './videos.json'
import { OnlyClip, OnlyPlaylist } from './components/player/types/types'
import Player from './components/player/player'
import LagRadar from 'react-lag-radar'
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

  const onChange = (key: 'title' | 'description', value: string) =>
    setTask(prev => ({ ...prev, [key]: value }))

  const videoYT: OnlyClip = { ...videos.youtube, __mode: 'clip' }
  const videoMP4: OnlyClip = { ...videos.mp4, __mode: 'clip' }
  const videoYTNoChapters: OnlyClip = {
    ...videos.youtube_without_chapters,
    __mode: 'clip',
  }
  const playlist: OnlyPlaylist = { ...videos.playlist, __mode: 'playlist' }
  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: 50,
          right: 50,
        }}
      >
        <LagRadar size={350} frames={60} />
      </div>
      {/* <h1>Todo app</h1>
      <input type="text" placeholder={'Title'} value={task.title} onChange={e => onChange('title', e.target.value)} />
      <input
        type="text"
        placeholder={'Description'}
        value={task.description}
        onChange={e => onChange('description', e.target.value)}
      />
      <button onClick={handleCommit}>{'>'}</button>

      <TasksList tasks={tasks} /> */}

      <Player {...videoYT} />
      <Player {...videoMP4} />
      <Player {...videoYTNoChapters} />
      <Player {...playlist} />
    </div>
  )
}
