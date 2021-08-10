import React from 'react'
import styled from 'styled-components'
import { SliderCommonProps } from '../types'
import { Direction } from 'react-player-controls'
import { COLORS } from './colors'

type StyledDIV = React.HTMLAttributes<HTMLDivElement>

type DotProps = StyledDIV & SliderCommonProps
type BarProps = StyledDIV & SliderCommonProps

export const Dot: React.FunctionComponent<DotProps> = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 100%;
  transform: scale(1);
  transition: transform 0.2s;
  padding: 5px;
  &:hover {
    transform: scale(1.3);
  }

  background-color: ${({ background }: DotProps) => (background ? background : COLORS.YT_RED)};

  ${({ direction, value }: DotProps) =>
    direction !== Direction.VERTICAL
      ? `top: 0;
        left: ${value * 100}%;
        margin-top: -4px;
        margin-left: -8px;
      `
      : `left: 0;
        bottom: ${value * 100}%;
        margin-bottom: -8px;
        margin-left: -4px;`}
`

export const Bar: React.FunctionComponent<BarProps> = styled.div`
  position: absolute;
  border-radius: 0;
  background-color: ${({ background }: BarProps) => (background ? background : COLORS.GREY_ALPHA)};
  ${({ direction, value }: BarProps) =>
    direction !== Direction.VERTICAL
      ? `
      top: 0;
      left:0;
      bottom:0;
      width: ${value * 100}%;
      `
      : `
      left:0;
      bottom:0;
      right: 0;
      height: ${value * 100}%;
      `}
`
