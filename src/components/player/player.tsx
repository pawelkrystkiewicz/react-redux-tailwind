import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'
import ChaptersList from './ChaptersList'
import Controls from './Controls'
import { getCurrentChapter, measureChapters } from './helper'
import SeekerBar from './SeekerBar'
import Settings from './Settings'
import { KeyCode } from './shortcuts'
import {
  Clip,
  CurrentSource,
  PlayerConfig,
  PlayerProgress,
  PlayerState,
  Playlist,
  PlaylistClip,
  VideoSource,
} from './types/types'
import { PlayerContainer } from './ui/Container'
import * as PlayerUI from './ui/PlayerUI'
import config from './config'
import FormattedTime from './FormattedTime'
import * as PlaylistUI from './ui/PlaylistUI'
import { PlaylistList } from './PlaylistList'

const { INITIAL_STATE, VOLUME_STEP, REWIND_STEP } = config

const Player: React.FunctionComponent<PlayerConfig> = media => {
  const playerRef = useRef<ReactPlayer>(null)
  const [state, setState] = useState<PlayerState>(INITIAL_STATE)
  const [source, setSource] = useState<CurrentSource | null>(null)

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

    if (media.__mode === 'playlist') {
      onProgressPlaylist(progress.playedSeconds)
    }

    setState(payload)
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
    youtube: {
      embedOptions: {},
      playerVars: {
        disablekb: 1,
        controls: 0,
        modestbranding: 1,
      },
    },
  }

  const showErrorOnInvalidSources = (): void =>
    setState({
      ...state,
      error:
        'Wystąpił błąd i nie możemy odtworzyć tego wideo. Skontaktuj się z nami.',
    })

  const getValidSource = (sources: VideoSource[]): VideoSource | undefined =>
    sources
      .sort((a, b) => a.priority - b.priority)
      .find(({ url }) => ReactPlayer.canPlay(url))

  const setValidSourceOrError = (sources: VideoSource[], orderId: number) => {
    const firstValidSource = getValidSource(sources)
    console.log('firstValidSource', !!firstValidSource)
    if (firstValidSource) {
      setSource({
        orderId,
        priorityId: firstValidSource.priority,
        url: firstValidSource.url,
      })
    } else {
      showErrorOnInvalidSources()
    }
  }
  // SOURCE HANDLING
  const initClip = (clip: Clip) => {
    setState({ ...state, title: clip.title })
    setValidSourceOrError(clip.sources, 1)
  }

  const initPlaylist = (playlist: Playlist) => {
    setState({ ...state, title: playlist.title })
    const firstClip = playlist.clips.filter(({ order }) => order === 1)[0]
    setValidSourceOrError(firstClip.sources, firstClip.order)
  }
  // PLAYLIST FEATURES
  const onProgressPlaylist = (seconds: number) => {
    console.log(seconds)
    const currentClip = getCurrentPlaylistClip()
    if (currentClip) {
      const { start, end } = currentClip
      console.log(start, seconds < start)
      console.log(end, seconds >= end)
      seconds < start && seekInVideo(start)
      seconds >= end && playlistNext()
    }
  }

  const getCurrentPlaylistClip = (): PlaylistClip | undefined => {
    const { playlist } = media
    if (source && playlist) {
      return playlist.clips.find(({ order }) => order === source.orderId)
    }
  }

  const jumpToPlaylistClip = (orderId: number) => {
    const { playlist } = media
    if (source && playlist) {
      const clip: PlaylistClip = playlist.clips.filter(
        ({ order }) => order === orderId
      )[0]
      clip && setValidSourceOrError(clip.sources, clip.order)
    }
  }
  const playlistNext = () => jumpToPlaylistClip(source!.orderId + 1)
  const playlistPrevious = () => jumpToPlaylistClip(source!.orderId - 1)

  useEffect(() => {
    console.log('useEffect')
    if (media.__mode === 'clip') {
      initClip(media.clip)
    }
    if (media.__mode === 'playlist') {
      initPlaylist(media.playlist)
    }
  }, [])

  const chapters = measureChapters(state.duration, media.clip?.chapters)
  const currentChapter = getCurrentChapter(chapters, state.playedSeconds)

  return (
    <PlayerContainer onKeyDownCapture={handleKeyboardShortcut} tabIndex={0}>
      {state.title && <h2>{state.title}</h2>}
      {media.__mode === 'playlist' && (
        <PlaylistList
          onClick={jumpToPlaylistClip}
          clips={media.playlist.clips}
          source={source}

        />
      )}

      <PlayerUI.Body>
        <PlayerUI.ClickCatcher onClick={togglePlay}>
          <ReactPlayer
            {...playerConfig}
            url={source?.url ?? ''}
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
      {state.error && (
        <PlayerUI.ErrorMessage>{state.error}</PlayerUI.ErrorMessage>
      )}
    </PlayerContainer>
  )
}

export default Player
