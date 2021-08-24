import React, { useCallback } from 'react'
import FormattedTime from './FormattedTime'
import { CurrentSource, PlaylistClip } from './types/types'
import * as PlaylistUI from './ui/PlaylistUI'

type PlaylistItemClickHandler = (order: number) => void

type PlaylistProps = {
  clips: PlaylistClip[]
  onClick: PlaylistItemClickHandler
  source: CurrentSource | null
}

export const PlaylistList = ({ clips, onClick, source }: PlaylistProps) => (
  <PlaylistUI.List>
    {clips.map(clip => (
      <PlaylistItem
        key={clip.order}
        clip={clip}
        onClick={onClick}
        active={clip.order === source?.orderId}
      />
    ))}
  </PlaylistUI.List>
)

type PlaylistItemClip = {
  clip: PlaylistClip
  onClick: PlaylistItemClickHandler
  active: boolean
}

const PlaylistItem = ({ clip, active, onClick }: PlaylistItemClip) => {
  const { order, title, start, end, cover } = clip
  const duration = end - start
  const handleItemClick = useCallback(() => onClick(order), [order, onClick])
  return (
    <PlaylistUI.Item onClick={handleItemClick}>
      <PlaylistUI.ItemCover active={active} src={cover || ''} alt={title} />
      <PlaylistUI.Title>{title}</PlaylistUI.Title>
      <PlaylistUI.ItemStart>
        <FormattedTime seconds={duration} />
      </PlaylistUI.ItemStart>
    </PlaylistUI.Item>
  )
}
