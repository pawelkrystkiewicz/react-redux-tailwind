import React, { useCallback } from 'react'
import FormattedTime from './FormattedTime'
import { isCurrentInChapterRange } from './helper'
import * as Chapters from './ui/ChapterList'

const ChapterList = ({ played, chapters, goToChapter }) => {
  return (
    <Chapters.List>
      {chapters.map(chapter => (
        <Entry chapter={chapter} played={played} goToChapter={goToChapter} />
      ))}
    </Chapters.List>
  )
}

const Entry = ({ goToChapter, played, chapter }) => {
  const { start, title } = chapter

  const goToChapterCallback = useCallback(
    () => goToChapter(start),
    [start, goToChapter]
  )

  const isCurrent = isCurrentInChapterRange(played)(chapter)

  return (
    <Chapters.Row>
      <Chapters.Timestamp onClick={goToChapterCallback} showMarker={isCurrent}>
        <FormattedTime seconds={start} />
      </Chapters.Timestamp>
      <Chapters.Title>{title}</Chapters.Title>
    </Chapters.Row>
  )
}

export default ChapterList
