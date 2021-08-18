import { Marks, Chapter, MeasuredChapter } from './types/types'

export const formatDuration = (seconds: number): string => {
  const formatted = new Date(seconds * 1000)
    .toUTCString()
    .match(/(\d\d:\d\d:\d\d)/)
  return formatted ? formatted[0] : seconds.toString()
}

const padZero = (digit: number): string => `${digit < 10 ? '0' : ''}${digit}`

export const getFormattedTime = (numSeconds: number): string => {
  const prefix = numSeconds < 0 ? '-' : ''
  const absNumSeconds = Math.abs(numSeconds)

  const hours = Math.floor(absNumSeconds / 3600)
  const minutes = Math.floor((absNumSeconds % 3600) / 60)
  const seconds = Math.floor(absNumSeconds) % 60

  return hours > 0
    ? `${prefix}${hours}:${padZero(minutes)}:${padZero(seconds)}`
    : `${prefix}${minutes}:${padZero(seconds)}`
}

export const toInt = (n: number): number => Math.trunc(n)

export const createChapterMarks = (chapters: Chapter[]): Marks => {
  let marks = {}
  chapters.forEach(
    ({ start, title }) => (marks[start] = title.substring(0, 10) + '...')
  )
  return marks
}

export const toProgressPercent = (progress: number): number =>
  Number((progress * 100).toFixed(4))

export const isCurrentInChapterRange =
  (current: number) =>
  (chapter: Chapter): boolean =>
    current >= chapter.start && current < chapter.end

export const getCurrentChapter = (
  chapters: Chapter[],
  current: number
): Chapter => {
  const comparator = isCurrentInChapterRange(current)
  return chapters.filter(comparator)[0]
}

export const measureChapters = (
  duration: number,
  chapters?: Chapter[]
): MeasuredChapter[] =>
  chapters
    ? chapters.map(chapter => {
        const runtime = chapter.end - chapter.start
        return {
          ...chapter,
          runtime,
          size: +(runtime / duration).toPrecision(2),
        }
      })
    : []
