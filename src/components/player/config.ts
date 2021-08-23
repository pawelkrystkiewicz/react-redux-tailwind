import { PlayerState } from './types/types'

type Config = {
  INITIAL_STATE: PlayerState
  VOLUME_STEP: number
  REWIND_STEP: number
}

const config: Config = {
  VOLUME_STEP: 0.05,
  REWIND_STEP: 5,
  INITIAL_STATE: {
    loadedSeconds: 0,
    playedSeconds: 0,
    loaded: 0,
    played: 0,
    current: 0,
    duration: 0,
    volume: 1,
    prevVolume: 1,
    playbackRate: 1,
    buffering: false,
    seeking: false,
    playing: false,
    controls: false,
    muted: false,
    loop: false,
  },
}

export default config
