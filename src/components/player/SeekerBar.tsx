import React, { useState } from 'react'
import { Direction, Slider } from 'react-player-controls'
import { MeasuredChapter } from './types'
import { COLORS } from './ui/colors'
import { Bar, Chapter, ChaptersContainer, Dot } from './ui/Sliders'

const { YT_RED, BLACK_ALPHA, GREY_ALPHA } = COLORS

interface ChaptersProgressBarProps {
  chapters: MeasuredChapter[]
  current: number
  playedSeconds: number
}
interface SeekerBarProps {
  current: number
  chapters: MeasuredChapter[]
  playedSeconds: number
  onChange: (sliderPosition: number) => void
  onChangeStart: (sliderPosition: number) => void
  onChangeEnd: () => void
}

const SeekerBar = ({
  current,
  chapters,
  playedSeconds,
  onChange,
  onChangeStart,
  onChangeEnd,
}: SeekerBarProps) => {
  const [lastIntent, setLastIntent] = useState(0)
  const hasChapters = chapters.length > 0

  return (
    <Slider
      direction={Direction.HORIZONTAL}
      style={{
        width: '100%',
        height: 4,
        borderRadius: 0,
        transition: 'width 0.1s',
        '&:hover': {
          transform: 'scale(1.5)',
        },
      }}
      onIntent={setLastIntent}
      onIntentStart={setLastIntent}
      onIntentEnd={setLastIntent.bind(0)}
      onChange={onChange}
      onChangeStart={onChangeStart}
      onChangeEnd={onChangeEnd}
    >
      {hasChapters ? (
        <ChaptersBaseBar chapters={chapters} />
      ) : (
        <Bar value={1} background={COLORS.GREY_ALPHA} />
      )}
      <Bar value={lastIntent} background={GREY_ALPHA} />
      {hasChapters ? (
        <ChaptersProgressBar
          chapters={chapters}
          current={current}
          playedSeconds={playedSeconds}
        />
      ) : (
        <Bar value={current} background={COLORS.YT_RED} />
      )}
      <Dot value={current} />
    </Slider>
  )
}

const ChaptersBaseBar = ({ chapters }: { chapters: MeasuredChapter[] }) => (
  <ChaptersContainer>
    {chapters.map(({ size }) => (
      <Chapter value={size} background={BLACK_ALPHA} />
    ))}
  </ChaptersContainer>
)

const ChaptersProgressBar = ({
  chapters,
  current,
  playedSeconds,
}: ChaptersProgressBarProps) => {
  const finishedChapters = chapters.filter(
    ({ end }: MeasuredChapter) => end < playedSeconds
  )
  const chaptersLengthPercent = finishedChapters.reduce(
    (acc, chapter) => acc + chapter.size,
    0
  )

  return (
    <ChaptersContainer>
      {finishedChapters.map(({ size }, index) => (
        <Chapter value={size} background={YT_RED} />
      ))}
      <Chapter value={current - chaptersLengthPercent} background={YT_RED} />
    </ChaptersContainer>
  )
}

export default SeekerBar
