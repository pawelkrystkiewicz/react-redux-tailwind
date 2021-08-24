import { Direction } from 'react-player-controls'

export type PlayerProgress = {
  playedSeconds: number
  loadedSeconds: number
  played: number
  loaded: number
  current?: number
}

export type PlayerState = PlayerProgress & {
  current: number
  duration: number
  playing: boolean
  controls: boolean
  muted: boolean
  playbackRate: number
  volume: number
  prevVolume: number
  loop: boolean
  seeking: boolean
  buffering: boolean
  title?: string
  url?: string
  error?: string
}

export type Marks = { [key: number]: string }

export type PlayerConfig = OnlyClip | OnlyPlaylist

export type OnlyClip = {
  clip: Clip
  playlist?: null
  __mode: 'clip'
}

export type OnlyPlaylist = {
  clip?: null
  playlist: Playlist
  __mode: 'playlist'
}

export type Clip = {
  title: string
  cover?: string
  chapters?: Chapter[]
  sources: VideoSource[]
}

export type Playlist = {
  title: string
  cover?: string
  clips: PlaylistClip[]
}

export type PlaylistClip = {
  title: string
  start: number
  end: number
  order: number
  cover?: string
  chapters?: Chapter[]
  sources: VideoSource[]
}

export type Chapter = {
  title: string
  start: number
  end: number
}

export type MeasuredChapter = Chapter & { runtime: number; size: number }

export type SliderCommonProps = {
  value: number
  background?: string
  direction?: Direction
  z?: number
}

export type VideoSource = {
  priority: number
  url: string
  name?: string
}

export type CurrentSource = {
  url: string
  orderId: number
  priorityId: number
}
