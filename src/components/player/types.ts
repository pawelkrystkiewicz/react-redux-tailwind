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
  progress: number
  duration: number
  playing: boolean
  controls: boolean
  muted: boolean
  playbackRate: number
  volume: number
  loop: boolean
  seeking: boolean
  buffered: number
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
  playlist: PlaylistElement[]
  __mode: 'playlist'
}

export type Clip = {
  title: string
  url: string
  chapters: Chapter[]
}

export type PlaylistElement = {
  title: string
  start: number
  end: number
  url: string
}

export type Chapter = {
  title: string
  start: number
  end: number
}

export enum KeyCode {
  enter = 'Enter',
  space = 'Space',
  arrowUp = 'ArrowUp',
  arrowDown = 'ArrowDown',
  arrowLeft = 'ArrowLeft',
  arrowRight = 'ArrowRight',
}

export type SliderCommonProps = {
  value: number
  background?: string
  direction?: Direction
}