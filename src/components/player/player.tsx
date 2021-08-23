import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'
import ChaptersList from './ChaptersList'
import Controls from './Controls'
import { getCurrentChapter, measureChapters } from './helper'
import SeekerBar from './SeekerBar'
import Settings from './Settings'
import { KeyCode } from './shortcuts'
import { PlayerConfig, PlayerProgress, PlayerState } from './types/types'
import { PlayerContainer } from './ui/Container'
import * as PlayerUI from './ui/PlayerUI'
import config from './config'

const { INITIAL_STATE, VOLUME_STEP, REWIND_STEP } = config

type SourceState = {
  clips: {
    order: number
    start: number
    end: number
    sources: {
      priority: number
      src: string
      name?: string
    }[]
  }[]
  current?: {
    src?: string
    id?: string
  }
}

const Player: React.FunctionComponent<PlayerConfig> = media => {
  const playerRef = useRef<ReactPlayer>(null)
  const [state, setState] = useState<PlayerState>(INITIAL_STATE)

  const [source, setSource] = useState<SourceState>({ clips: [] })

  /* EVENTS of react-player */
  const onDuration = (duration: number): void =>
    setState({ ...state, duration })
  const onProgress = (progress: PlayerProgress): void => {
    let payload: PlayerState = { ...state, ...progress }

    if (!state.seeking) {
      payload.current = progress.played
      /* When seeking we want progress indicator to follow user input
         When playing we update this with actual played % value
      */
    }

    setState(payload)
  }

  const onEnded = (): void => {
    console.log('end of file')
  }

  /* LOADING / BUFFERING */
  const onBuffer = (): void => setState({ ...state, buffering: true })
  const onBufferEnd = (): void => setState({ ...state, buffering: false })

  /* PROGRESS BAR functions  */
  const handleSeekerChange = (sliderPosition: number): void =>
    setState({ ...state, current: sliderPosition })

  const handleSeekerChangeStart = (sliderPosition: number): void => {
    seekInVideo(sliderPosition)
    setState({
      ...state,
      seeking: true,
      playing: false,
      current: sliderPosition,
    })
  }
  const handleSeekerChangeEnd = (): void =>
    setState({
      ...state,
      seeking: false,
      playing: true,
    })

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
  const seekInVideo = (secondsOrPercent: number): void | null => {
    playerRef.current && playerRef.current.seekTo(secondsOrPercent)
    // secondsOrPercent < 1 && handleSeekerChange(secondsOrPercent)
  }
  const jumpForward = (): void | null =>
    seekInVideo(state.playedSeconds + REWIND_STEP)
  const jumpBackward = (): void | null =>
    seekInVideo(state.playedSeconds - REWIND_STEP)
  const jumpToStart = (): void | null => seekInVideo(0)
  const jumpToEnd = (): void | null => seekInVideo(state.duration)

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
      case KeyCode.Home:
        jumpToStart()
        break
      case KeyCode.End:
        jumpToEnd()
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

  useEffect(() => {
    console.log('useEffect')
    if (media.__mode === 'clip') {
      setState({ ...state, title: media.clip.title, url: media.clip.url })
    }
    if (media.__mode === 'playlist') {
      setState({
        ...state,
        title: media.playlist.title,
        url: media.playlist.clips[0].url,
      })
    }
  }, [])

  const chapters = measureChapters(state.duration, media.clip?.chapters)
  const currentChapter = getCurrentChapter(chapters, state.playedSeconds)

  return (
    <PlayerContainer onKeyDownCapture={handleKeyboardShortcut} tabIndex={0}>
      {state.title && <h2>{state.title}</h2>}

      <PlayerUI.Body>
        <PlayerUI.ClickCatcher onClick={togglePlay}>
          <ReactPlayer
            {...playerConfig}
            url={state.url}
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
            duration={state.duration}
            current={state.current}
            loaded={state.loaded}
            chapters={chapters}
            onChange={handleSeekerChange}
            onChangeEnd={handleSeekerChangeEnd}
            onChangeStart={handleSeekerChangeStart}
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

export default Player
