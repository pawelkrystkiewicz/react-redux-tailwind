import React from 'react'
import styled from 'styled-components'

type StyledDIV = React.HTMLAttributes<HTMLDivElement>

export const Container: React.FunctionComponent<StyledDIV> = styled.div`
  position: absolute;
  bottom: 0px;
  max-width: 100%;
  width: 100%;
`
export const Body: React.FunctionComponent<StyledDIV> = styled.div`
  position: relative;
  width: 100%;
  &:hover ${Container} {
    opacity: 1;
  }

  ${Container} {
    opacity: 0;
    transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1);
  }

  color: #fff;
  font-size: 13px;
`

export const VolumeBarWrapper: React.FunctionComponent<StyledDIV> = styled.div`
  height: 4px;
  width: 0;
  opacity: 0;
  transition: all 0.2s 0.2s ease-in-out;

  &:hover {
    width: 50px;
    opacity: 1;
  }
`
export const VolumeControls: React.FunctionComponent<StyledDIV> = styled.div`
  &:hover ~ ${VolumeBarWrapper} {
    width: 50px;
    opacity: 1;
  }
`

export const ControlPanel: React.FunctionComponent<StyledDIV> = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  height: 40px;
`

export const Controls: React.FunctionComponent<StyledDIV> = styled.div`
  height: 100%;

  flex: 1;

  display: flex;
  flex-wrap: nowrap;
  column-gap: 5px;
  align-items: center;
  align-content: center;
`

export const Chapters: React.FunctionComponent<StyledDIV> = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  flex: 0 1 100%;
  float: left;
`
export const Settings: React.FunctionComponent<StyledDIV> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  float: right;
  /* flex: 2; */
`

export enum ButtonIcon {
  'play',
  'pause',
  'volume-muted',
  'volume-full',
  'volume-half',
  'settings',
  'fullscreen',
  'fullscreen-exit',
}

type PlayerButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  icon?: ButtonIcon
}

export const Button: React.FunctionComponent<PlayerButtonProps> = styled.button`
  height: 40px;
  width: 46px;
  flex: 0 0 auto;
  cursor: pointer;
  color: #fff;
  ${({ icon }: PlayerButtonProps) =>
    !icon ? `` : `::before {content: url("icons/${icon}.svg");}`}
`

export const TimeTracker: React.FunctionComponent<PlayerButtonProps> = styled.button`
  padding: 0 2px;
`

export const ClickCatcher: React.FunctionComponent<StyledDIV> = styled.div``
