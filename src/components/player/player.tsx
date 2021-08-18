import React, { useRef, useState } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'
import ChaptersList from './ChaptersList'
import Controls from './Controls'
import { getCurrentChapter, measureChapters, toProgressPercent } from './helper'
import { ReactComponent as PauseIcon } from './icons/pause.svg'
import { ReactComponent as PlayIcon } from './icons/play.svg'
import { ReactComponent as VolumeFullIcon } from './icons/volume-full.svg'
import { ReactComponent as VolumeHalfIcon } from './icons/volume-half.svg'
import { ReactComponent as VolumeMutedIcon } from './icons/volume-muted.svg'
import SeekerBar from './SeekerBar'
import Settings from './Settings'
import { KeyCode } from './shortcuts'
import TimeTracker from './TimeTracker'
import { PlayerConfig, PlayerProgress, PlayerState } from './types/types'
import { PlayerContainer } from './ui/Container'
import * as PlayerUI from './ui/PlayerUI'
import VolumeBar from './VolumeBar'

const VOLUME_STEP = 0.05
const REWIND_STEP = 5

const INITIAL_STATE: PlayerState = {
  loadedSeconds: 0,
  playedSeconds: 0,
  loaded: 0,
  played: 0,
  current: 0,
  duration: 0,
  progress: 0,
  volume: 1,
  prevVolume: 1,
  playbackRate: 1,
  buffering: false,
  seeking: false,
  playing: false,
  controls: false,
  muted: false,
  loop: false,
}

const Player: React.FunctionComponent<PlayerConfig> = media => {
  const [state, setState] = useState<PlayerState>(INITIAL_STATE)
  const playerRef = useRef<ReactPlayer>(null)

  /* EVENTS of react-player */
  const onDuration = (duration: number): void =>
    setState({ ...state, duration })
  const onProgress = (progress: PlayerProgress): void => {
    const payload = {
      ...progress,
      progress: toProgressPercent(progress.played),
    }

    !state.seeking && (payload.current = progress.played)

    setState({ ...state, ...payload })
  }
  const onEnded = (): void => {
    console.log('end of file')
  }

  /* LOADING / BUFFERING */
  const onBuffer = (): void => setState({ ...state, buffering: true })
  const onBufferEnd = (): void => setState({ ...state, buffering: false })

  /* PROGRESS BAR functions  */
  const handleSeekerChange = (sliderPosition: number): void => {
    setState({ ...state, current: sliderPosition })
  }
  const handleSeekerChangeStart = (sliderPosition: number): void => {
    setState({ ...state, seeking: false, playing: true })
    seekInVideo(sliderPosition)
  }
  const handleSeekerChangeEnd = (): void => {
    setState({ ...state, seeking: true })
  }

  /* BASIC CONTROLS */
  const togglePlay = (): void => setState({ ...state, playing: !state.playing })
  const toggleMute = (): void => (!!state.volume ? mute() : unmute())
  const mute = (): void => setState({ ...state, volume: 0 })
  const unmute = (): void =>
    setState({
      ...state,
      volume: !!state.prevVolume ? state.prevVolume : INITIAL_STATE.volume,
    })

  const setPlaybackRate = (playbackRate): void =>
    setState({ ...state, playbackRate })

  /* POSITION */
  const jumpForward = (): void | null =>
    seekInVideo(state.playedSeconds + REWIND_STEP)
  const jumpBackward = (): void | null =>
    seekInVideo(state.playedSeconds - REWIND_STEP)
  const seekInVideo = (secondsOrPercent: number): void | null =>
    playerRef.current && playerRef.current.seekTo(secondsOrPercent)

  /* VOLUME */
  const changeVolume = (volume: number): void => {
    if (volume >= 0 && volume <= 1)
      setState({ ...state, volume, prevVolume: volume })
  }
  const stepUpVolume = (): void => changeVolume(state.volume + VOLUME_STEP)
  const stepDownVolume = (): void => changeVolume(state.volume - VOLUME_STEP)

  /* KEYBOARD HANDLER*/
  const handleKeyboardShortcut = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    event.preventDefault()
    console.log(event.code)
    switch (event.code) {
      case KeyCode.Space:
        togglePlay()
        break
      case KeyCode.ArrowUp:
        stepUpVolume()
        break
      case KeyCode.ArrowDown:
        stepDownVolume()
        break
      case KeyCode.ArrowLeft:
        jumpBackward()
        break
      case KeyCode.ArrowRight:
        jumpForward()
        break
      case KeyCode.F:
        console.log('toggleFullscreen')
        break
      case KeyCode.M:
        toggleMute()
        break
      case KeyCode.K:
        togglePlay()
        break

      default:
        break
    }
  }

  /* CONFIG react-player */
  const playerConfig: Partial<ReactPlayerProps> = {
    style: { pointerEvents: 'none' },
    ref: playerRef,
    fallback: <span>Loading...</span>,
    stopOnUnmount: true,
    onProgress,
    onDuration,
    onBuffer,
    onBufferEnd,
    onEnded,

    youtube: {
      embedOptions: {},
      playerVars: {
        disablekb: 1,
        controls: 0,
        modestbranding: 1,
      },
    },
  }

  if (media.playlist) {
    return <div>Playlist: TODO</div>
  }

  if (media.clip) {
    const { title, url } = media.clip
    const chapters = measureChapters(state.duration, media.clip.chapters)
    const currentChapter = getCurrentChapter(chapters, state.playedSeconds)
    return (
      <PlayerContainer onKeyDownCapture={handleKeyboardShortcut} tabIndex={0}>
        {title && <h2>{title}</h2>}

        <PlayerUI.Body>
          <PlayerUI.ClickCatcher onClick={togglePlay}>
            <ReactPlayer
              {...playerConfig}
              url={url}
              playing={state.playing}
              controls={state.controls}
              playbackRate={state.playbackRate}
              volume={state.volume}
              muted={state.muted}
              config={playerConfig.config}
            />
          </PlayerUI.ClickCatcher>
          <PlayerUI.Container>
            <SeekerBar
              current={state.current}
              chapters={chapters}
              onChange={handleSeekerChange}
              onChangeEnd={handleSeekerChangeEnd}
              onChangeStart={handleSeekerChangeStart}
              playedSeconds={state.playedSeconds}
            />
            <PlayerUI.ControlPanel>
              <Controls
                state={state}
                currentChapter={currentChapter}
                onTogglePlay={togglePlay}
                onToggleMute={toggleMute}
                onVolumeChange={changeVolume}
              />
              <Settings />
            </PlayerUI.ControlPanel>
          </PlayerUI.Container>
        </PlayerUI.Body>
        <ChaptersList
          chapters={chapters}
          played={state.playedSeconds}
          goToChapter={seekInVideo}
        />
      </PlayerContainer>
    )
  }

  return (
    <div>{"You can't reach this | TypeScript is stupid sometimes :)"} </div>
  )
}

export default Player
