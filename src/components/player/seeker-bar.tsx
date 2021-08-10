import React, { useState } from 'react'
import { Slider, Direction } from 'react-player-controls'
import { COLORS } from './ui/colors'
import * as StyledSlider from './ui/Slider'
const { YT_RED, GREY_ALPHA, BLACK_ALPHA } = COLORS

const SeekerBar = ({ current, onChange, onAfterChange, onSeekerMouseDown, chapters }) => {
  const [lastIntent, setLastIntent] = useState(0)

  return (
    <div className="player__bar--wrapper interactive">
      <Slider
        direction={Direction.HORIZONTAL}
        style={{
          width: '100%',
          height: 4,
          borderRadius: 0,
          background: GREY_ALPHA,
          transition: 'width 0.1s',
        }}
        onIntent={setLastIntent}
        onIntentStart={setLastIntent}
        onIntentEnd={() => setLastIntent(0)}
        onChange={onChange}
        onChangeStart={onSeekerMouseDown}
        onChangeEnd={onAfterChange}>
        <StyledSlider.Bar value={1} />
        <StyledSlider.Dot value={current} />
        <StyledSlider.Bar value={lastIntent} background={BLACK_ALPHA} />
        <StyledSlider.Bar value={current} background={YT_RED} />
      </Slider>
    </div>
  )
}

export default SeekerBar
