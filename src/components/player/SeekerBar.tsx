import React, { useCallback, useState } from 'react'
import { Direction, Slider } from 'react-player-controls'
import { MeasuredChapter } from './types/types'
import { COLORS } from './ui/colors'
import { Bar, Chapter, ChaptersContainer, Dot } from './ui/Sliders'

const { YT_RED, BLACK_ALPHA, GREY_ALPHA } = COLORS

interface ChaptersProgressBarProps {
  chapters: MeasuredChapter[]
  duration: number
  progressPercent: number
  background: string
}

interface SeekerBarProps {
  loaded: number
  current: number
  duration: number
  chapters: MeasuredChapter[]
  onChange: (sliderPosition: number) => void
  onChangeStart: (sliderPosition: number) => void
  onChangeEnd: () => void
}

const SeekerBar = ({
  loaded,
  current,
  chapters,
  duration,
  onChange,
  onChangeStart,
  onChangeEnd,
}: SeekerBarProps) => {
  const [lastIntent, setLastIntent] = useState(0)
  const hasChapters = chapters.length > 0

  const set0 = useCallback(() => setLastIntent(0), [])

  return (
    <Slider
      direction={Direction.HORIZONTAL}
      style={{
        width: 'auto',
        height: 4,
        borderRadius: 0,
        transition: 'width 0.1s',
        flex: '1 100%',
        margin: '0 12px',
      }}
      onIntent={setLastIntent}
      onIntentStart={setLastIntent}
      onIntentEnd={set0}
      onChange={onChange}
      onChangeStart={onChangeStart}
      onChangeEnd={onChangeEnd}
    >
      {hasChapters ? (
        <ChaptersBaseBar chapters={chapters} />
      ) : (
        <Bar value={1} background={GREY_ALPHA} />
      )}

      {hasChapters ? (
        <ChaptersProgressBar
          chapters={chapters}
          duration={duration}
          progressPercent={lastIntent}
          background={GREY_ALPHA}
        />
      ) : (
        <Bar value={lastIntent} background={GREY_ALPHA} />
      )}
      {hasChapters ? (
        <ChaptersProgressBar
          chapters={chapters}
          duration={duration}
          progressPercent={loaded}
          background={GREY_ALPHA}
        />
      ) : (
        <Bar value={loaded} background={GREY_ALPHA} />
      )}
      {hasChapters ? (
        <ChaptersProgressBar
          chapters={chapters}
          progressPercent={current}
          duration={duration}
          background={YT_RED}
        />
      ) : (
        <Bar value={current} background={YT_RED} />
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
  duration,
  progressPercent,
  background,
}: ChaptersProgressBarProps) => {
  const currentSeconds = duration * progressPercent
  const finishedChapters = chapters.filter(({ end }) => end < currentSeconds)

  const chaptersLengthPercent = finishedChapters.reduce(
    (acc, chapter) => acc + chapter.size,
    0
  )

  return (
    <ChaptersContainer>
      {finishedChapters.map(({ size }) => (
        <Chapter value={size} background={background} />
      ))}
      <Chapter
        value={progressPercent - chaptersLengthPercent}
        background={background}
      />
    </ChaptersContainer>
  )
}

export default SeekerBar
