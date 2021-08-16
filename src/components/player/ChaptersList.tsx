import React from 'react'
import { FormattedTime } from 'react-player-controls'
import { isCurrentInChapterRange } from './helper'

const ChapterList = ({ played, chapters, goToChapter }) => {
  return (
    <React.Fragment key="chapters">
      <table className="player__chapters">
        {chapters.map(c => (
          <tr>
            <td>{isCurrentInChapterRange(played)(c) && <span className="player__chapters--current-dot" />}</td>
            <td>
              <span onClick={() => goToChapter(c.start)} className="player__chapters--timestamp interactive">
                {<FormattedTime numSeconds={c.start} />}
              </span>
            </td>

            <td>
              <span>{c.title}</span>
            </td>
          </tr>
        ))}
      </table>
    </React.Fragment>
  )
}

export default ChapterList
