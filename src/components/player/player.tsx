import React, { useState, useRef } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'
import ChapterList from './chapters'
import { getCurrentChapter, toProgressPercent } from './helper'
import { PlayerState, PlayerProgress, PlayerConfig, KeyCode } from './types'
import SeekerBar from './seeker-bar'
import { FormattedTime, PlayerIcon, Button } from 'react-player-controls'
import './style.css'
import { Container } from './ui/Container'

const VOLUME_STEP = 5
const REWIND_STEP = 5

const INITIAL_STATE: PlayerState = {
  loadedSeconds: 0,
  playedSeconds: 0,
  loaded: 0,
  played: 0,
  current: 0,
  duration: 0,
  progress: 0,
  buffered: 0,
  volume: 1,
  playbackRate: 1,
  seeking: false,
  playing: false,
  controls: false,
  muted: false,
  loop: false,
}

const Player: React.FunctionComponent<PlayerConfig> = media => {
  const [state, setState] = useState<PlayerState>(INITIAL_STATE)
  const playerRef = useRef<ReactPlayer>(null)

  /* HANDLERS of react-player */
  const onDuration = (duration: number): void => setState({ ...state, duration })
  const onProgress = (progress: PlayerProgress): void => {
    const payload = {
      ...progress,
      progress: toProgressPercent(progress.played),
    }

    !state.seeking && (payload.current = progress.played)

    setState({ ...state, ...payload })
  }

  /* PROGRESS BAR functions  */
  const onChange = (sliderPosition: number): void => setState({ ...state, current: sliderPosition })
  const onAfterChange = (sliderPosition: number): void => {
    setState({ ...state, seeking: false, playing: true })
    seekInVideo(sliderPosition)
  }
  const onSeekerMouseDown = (): void => setState({ ...state, seeking: true })

  /* BASIC CONTROLS */
  const togglePlay = (): void => setState({ ...state, playing: !state.playing })
  const toggleMute = (): void => setState({ ...state, muted: !state.muted })

  /* POSITION */
  const jumpForward = (): void | null => seekInVideo(state.playedSeconds + REWIND_STEP)
  const jumpBackward = (): void | null => seekInVideo(state.playedSeconds - REWIND_STEP)
  const seekInVideo = (secondsOrPercent: number): void | null =>
    playerRef.current && playerRef.current.seekTo(secondsOrPercent)

  /* VOLUME */
  const changeVolume = (volume: number): void => setState({ ...state, volume })
  const stepUpVolume = (): void => changeVolume(state.volume + VOLUME_STEP)
  const stepDownVolume = (): void => changeVolume(state.volume - VOLUME_STEP)

  /* KEYBOARD HANDLER*/
  const handleKeyboardShortcut = (event: React.KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault()
    switch (event.code) {
      case KeyCode.space:
        togglePlay()
        break
      case KeyCode.arrowUp:
        stepUpVolume()
        break
      case KeyCode.arrowDown:
        stepDownVolume()
        break
      case KeyCode.arrowLeft:
        jumpBackward()
        break
      case KeyCode.arrowRight:
        jumpForward()
        break
      case KeyCode.enter:
        // toggleFullscreen()
        console.log('toggleFullscreen')
        break

      default:
        break
    }
  }
  /* CONFIG react-player */
  const playerConfig: Partial<ReactPlayerProps> = {
    ref: playerRef,
    fallback: <span>Loading...</span>,
    stopOnUnmount: true,
    onProgress,
    onDuration,
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
    const { title, url, chapters } = media.clip
    const currentChapter = getCurrentChapter(chapters, state.playedSeconds)
    console.log(currentChapter)
    return (
      <Container onKeyDownCapture={handleKeyboardShortcut} tabIndex={0}>
        {title && <h2>{title}</h2>}
        <ReactPlayer
          {...playerConfig}
          url={url}
          playing={state.playing}
          controls={state.controls}
          playbackRate={state.playbackRate}
          volume={state.volume}
          muted={state.muted}
          style={{ pointerEvents: 'none' }}
        />
        <br />
        <Controls
          state={state}
          chapters={chapters}
          currentChapter={currentChapter}
          onChange={onChange}
          onAfterChange={onAfterChange}
          onSeekerMouseDown={onSeekerMouseDown}
          togglePlay={togglePlay}
        />
        <ChapterList chapters={chapters} played={state.playedSeconds} goToChapter={seekInVideo} />
      </Container>
    )
  }

  return <div>{"You can't reach this but hey TypeScript is stupid sometimes :)"} </div>
}

const Controls = ({ state, chapters, currentChapter, togglePlay, onChange, onAfterChange, onSeekerMouseDown }) => {
  return (
    <>
      <Button onClick={togglePlay} style={{ height: 46, width: 40, padding: 10 }}>
        {state.playing ? <PlayerIcon.Pause /> : <PlayerIcon.Play />}
      </Button>
      <SeekerBar
        current={state.current}
        chapters={chapters}
        onChange={onChange}
        onAfterChange={onAfterChange}
        onSeekerMouseDown={onSeekerMouseDown}
      />
      <TimeTracker {...state} />
      {currentChapter && (
        <>
          &nbsp;&#183;&nbsp;<span>{currentChapter.title.substring(0, 50) + '...'}</span>
        </>
      )}
    </>
  )
}

const TimeTracker = ({ playedSeconds, duration }) => (
  <>
    <FormattedTime numSeconds={playedSeconds} />
    &nbsp;/&nbsp;
    <FormattedTime numSeconds={duration} />
  </>
)

export default Player
