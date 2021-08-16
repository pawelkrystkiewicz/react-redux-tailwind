import React from 'react'
import styled from 'styled-components'

type StyledDIV = React.HTMLAttributes<HTMLDivElement>

export const Container: React.FunctionComponent<StyledDIV> = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
`
export const Body: React.FunctionComponent<StyledDIV> = styled.div`
  position: relative;
  &:hover ${Container} {
    opacity: 1;
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
  height: 4px;
  opacity: 0;
  transition: all 0.2s 0.2s ease-in-out;
`
export const VolumeControls: React.FunctionComponent<StyledDIV> = styled.div``
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

  &:hover ${VolumeControls} ~ ${VolumeBarWrapper} {
    width: 50px;
    opacity: 1;
  }
`

export const Chapters: React.FunctionComponent<StyledDIV> = styled.div`
  color: white;
  font-size: 13px;
  max-width: 50%;
`
