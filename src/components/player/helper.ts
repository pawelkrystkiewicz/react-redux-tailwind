import { Marks, Chapter } from './types'

export const formatDuration = (seconds: number): string => {
  const formatted = new Date(seconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)
  return formatted ? formatted[0] : seconds.toString()
}

export const toInt = (n: number): number => Math.trunc(n)

export const createChapterMarks = (chapters: Chapter[]): Marks => {
  let marks = {}
  chapters.forEach(({ start, title }) => (marks[start] = title.substring(0, 10) + '...'))
  return marks
}

export const toProgressPercent = (progress: number): number => Number((progress * 100).toFixed(4))

export const isCurrentInChapterRange =
  (current: number) =>
  (chapter: Chapter): boolean =>
    current >= chapter.start && current < chapter.end

export const getCurrentChapter = (chapters: Chapter[], current: number): Chapter => {
  const comparator = isCurrentInChapterRange(current)
  const filtered = chapters.filter(comparator)
  console.log(current)
  console.log(filtered)
  return filtered[0]
}
