import React from 'react'
import styled from 'styled-components'
import VolumeBar from '../VolumeBar'
type StyledDIV = React.HTMLAttributes<HTMLDivElement>

export const Container: React.FunctionComponent<StyledDIV> = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
`
export const Body: React.FunctionComponent<StyledDIV> = styled.div`
  position: relative;
  &:hover {
    ${Container} {
      opacity: 1;
    }
  }
  ${Container} {
    opacity: 0;
    transition: opacity 0.1s linear;
  }

  color: #fff;
  font-size: 13px;
`

export const VolumeBarWrapper: React.FunctionComponent<StyledDIV> = styled.div`
  width: 0;
  max-width: 50px;
  height: 4px;
  display: none;
`
export const VolumeControls: React.FunctionComponent<StyledDIV> = styled.div`
  &:hover {
    ${VolumeBarWrapper} {
      width: 50px;
      display: block;
    }
  }
`
export const Controls: React.FunctionComponent<StyledDIV> = styled.div`
  bottom: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.5) 100%
  );

  display: flex;
  flex-wrap: nowrap;
  column-gap: 5px;

  align-items: center;
  align-content: center;

  ${VolumeControls} {
    &:hover {
      transition: width 0.2s linear;
    }
  }
`

export const Chapters: React.FunctionComponent<StyledDIV> = styled.div`
  color: white;
  font-size: 13px;
  max-width: 50%;
`
