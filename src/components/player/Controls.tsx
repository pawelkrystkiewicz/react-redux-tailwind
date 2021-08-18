import React from 'react'
import { ReactComponent as PauseIcon } from './icons/pause.svg'
import { ReactComponent as PlayIcon } from './icons/play.svg'
import { ReactComponent as VolumeFullIcon } from './icons/volume-full.svg'
import { ReactComponent as VolumeHalfIcon } from './icons/volume-half.svg'
import { ReactComponent as VolumeMutedIcon } from './icons/volume-muted.svg'
import TimeTracker from './TimeTracker'
import { Chapter, PlayerState } from './types/types'
import * as PlayerUI from './ui/PlayerUI'
import VolumeBar from './VolumeBar'

interface ControlsProps {
  state: PlayerState
  currentChapter: Chapter
  onTogglePlay: () => void
  onToggleMute: () => void
  onVolumeChange: (volume: number) => void
}

const Controls = ({
  state,
  currentChapter,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}: ControlsProps) => {
  return (
    <>
      <PlayerUI.Controls>
        <PlayerUI.Button onClick={onTogglePlay}>
          {state.playing ? <PauseIcon /> : <PlayIcon />}
        </PlayerUI.Button>

        <PlayerUI.VolumeControls>
          <PlayerUI.Button onClick={onToggleMute}>
            {!state.volume ? (
              <VolumeMutedIcon />
            ) : state.volume >= 0.5 ? (
              <VolumeFullIcon />
            ) : (
              <VolumeHalfIcon />
            )}
          </PlayerUI.Button>
        </PlayerUI.VolumeControls>
        <PlayerUI.VolumeBarWrapper>
          <VolumeBar volume={state.volume} onChange={onVolumeChange} />
        </PlayerUI.VolumeBarWrapper>

        <TimeTracker
          playedSeconds={state.playedSeconds}
          duration={state.duration}
        />
      </PlayerUI.Controls>
      <PlayerUI.Chapters>
        {currentChapter && (
          <span>&nbsp;&#183;&nbsp;{currentChapter.title}</span>
        )}
      </PlayerUI.Chapters>
    </>
  )
}
export default Controls
