import React from 'react'
import { Direction, Slider } from 'react-player-controls'
import { COLORS } from './ui/colors'
import * as StyledSlider from './ui/Sliders'

interface VolumeBarProps {
  volume: number
  onChange: (sliderPosition: number) => void
}

const VolumeBar = ({ volume, onChange }: VolumeBarProps) => (
  <Slider
    direction={Direction.HORIZONTAL}
    onChange={onChange}
    style={{ width: '100%', height: 4 }}
  >
    <StyledSlider.Bar value={1} background={COLORS.GREY_ALPHA} />
    <StyledSlider.Bar value={volume} background={COLORS.WHITE} />
    <StyledSlider.Dot value={volume} background={COLORS.WHITE} />
  </Slider>
)

export default VolumeBar
