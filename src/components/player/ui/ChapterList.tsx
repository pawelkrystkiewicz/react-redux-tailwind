import React from 'react'
import styled from 'styled-components'
import { StyledDIV, StyledSpan } from '../types/styled'
import { COLORS as C } from './colors'

export const List: React.FunctionComponent<
  React.HTMLAttributes<StyledDIV>
> = styled.div`
  margin-top: 10px;
  font-size: 13px;
`

export const Row: React.FunctionComponent<
  React.HTMLAttributes<StyledDIV>
> = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: center;
  column-gap: 10px;
`

type TimestampProps = React.HTMLAttributes<StyledSpan> & { showMarker: boolean }

export const Timestamp: React.FunctionComponent<TimestampProps> = styled.span`
  color: ${C.THEME_COLOR};
  position: relative;
  cursor: pointer;
  width: 50px;
  text-align: right;

  &:before {
    position: absolute;
    display: ${({ showMarker }: TimestampProps) =>
      showMarker ? 'inline-block' : 'none'};
    width: 7px;
    height: 7px;
    background-color: ${C.THEME_COLOR};
    border-radius: 100%;
    content: '';
    left: -12px;
    top: 5px;
  }
`
export const Title: React.FunctionComponent<
  React.HTMLAttributes<StyledSpan>
> = styled.span`
  flex: 1;
`
