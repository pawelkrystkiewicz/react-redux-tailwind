import React from 'react'
import styled from 'styled-components'
import { StyledDIV, StyledIMG } from '../types/styled'
import { COLORS } from './colors'

export const List: React.FunctionComponent<StyledDIV> = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #000;
  background-color: rgba(0, 0, 0, 0.4);
  height: auto;
  overflow-y: auto;
  row-gap: 15px;
`

export const Item: React.FunctionComponent<StyledDIV> = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px 20px;
  grid-template-areas:
    'cover title'
    'cover start';
  height: 75px;
`
export const Title: React.FunctionComponent<StyledDIV> = styled.div`
  grid-area: title;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`
export const ItemStart: React.FunctionComponent<StyledDIV> = styled.div`
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 2px 4px;
  width: min-content;
  height: min-content;
  font-size: 13px;
  color: ${COLORS.THEME_COLOR};
  grid-area: start;
`
export const ItemCover: React.FunctionComponent<
  StyledIMG & { src: string; alt: string } & { active?: boolean }
> = styled.image`
  width: 100px;
  height: auto;
  aspect-ratio: 4/3;
  background-color: #000;
  border: 2px solid
    ${({ active }) => (active ? COLORS.THEME_COLOR : 'transparent')};

  grid-area: cover;
`
