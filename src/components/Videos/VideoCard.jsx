import React, { useState } from 'react'
import styled from 'styled-components/macro'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardHeader from '@material-ui/core/CardHeader'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import { Typography } from '@material-ui/core'
import { faker } from '@faker-js/faker';
import ReactPlayer from 'react-player'
import HoverVideoPlayer from 'react-hover-video-player';

import {
  TWO_COL_MIN_WIDTH,
  getFormattedDurationString,
  useGetChannelDetails,
} from '../../utils/utils'
import { ChannelDetails } from './ChannelDetails'
import { MoreButton } from './MoreButton'

const VideoCard = ({ video }) => {

  const {
    personalization_id: videoId,
    thumbnail_url,
    url,
    duration = faker.datatype.number(),
    channelId, channelTitle, title = faker.company.name(), publishedAt = faker.random.numeric(1),
    viewCount = faker.datatype.number(),
  } = video

  const thumbnailImage = thumbnail_url

  const formattedDuration = getFormattedDurationString(duration)
  const [channelAvatar, setChannelAvatar] = useState(null)

  // Get channelAvatar
  useGetChannelDetails(
    true, //useLocalStorage
    true, // isVideo
    videoId,
    channelId,
    setChannelAvatar,
    null // channelInfoSetterFunction
  )

  return (
    <StyledCard square={true} elevation={0}>
      <HoverVideoPlayer
        videoSrc={url}
        volume={1}
        muted={false}
        className="videoClassName"
        // videoClassName="videoClassName"
        // hoverOverlayWrapperClassName="videoClassName"
        pausedOverlay={
          <img
            src={thumbnailImage}
            alt="youtube"
            style={{
              // Make the image expand to cover the video's dimensions
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        }
      />
      {/* <Thumbnail {...{ thumbnailImage, formattedDuration, url }} /> */}

      <StyledCardHeader
        avatar={<StyledAvatar src={channelAvatar ? channelAvatar : ''} />}
        title={<VideoTitle variant="h3">{title}</VideoTitle>}
        subheader={
          <ChannelDetails {...{ channelTitle, publishedAt, viewCount }} />
        }
      />
    </StyledCard>
  )
}

export default VideoCard

const Thumbnail = ({ thumbnailImage, formattedDuration, url }) => {
  return (
    <div>
      {/* <ReactPlayer url={url} /> */}
    <ImageContainer>
      <CardMedia
        // every video has medium size thumbnail, use as fallback if maxres not available
        image={thumbnailImage}
        component="img"
        style={{ width: '100%', cursor: 'pointer' }}
      />
      <DurationContainer variant="body2">{formattedDuration}</DurationContainer>
    </ImageContainer>
    </div>
  )
}

export const StyledIconButton = styled(IconButton)`
  && {
    padding: 8px;
    color: #030303;

    &:hover {
      background-color: transparent;
    }
  }
`

export const ImageContainer = styled.div`
  /* for the duration container in bottom right corner */
  position: relative;
`

export const DurationContainer = styled(Typography)`
  && {
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 4px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    border-radius: 2px;
    padding: 1px 4px;
    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      padding: 2px 6px;
    }
  }
`

const StyledCard = styled(Card)`
  && {
    transition: transform .5s;
    width: 100%;
    cursor: pointer;
    margin-bottom: 10px;
    border-radius: 0px;
    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      border-radius: 8px;
      margin-bottom: 30px; // original is 40px but 30px here account for padding
    }
  }
  &:hover,
  &:focus {
    z-index: 1000;
    transform: scale(1.1);
    border: 1px solid #efefef;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }
`

export const StyledCardHeader = styled(CardHeader)`
  && {
    padding: 10px;

    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      padding: 10px 0;
    }
  }
  .MuiCardHeader-avatar {
    align-self: flex-start;
    margin-right: 0;
  }
  .MuiCardHeader-content {
    padding-left: 12px;
  }
`

export const VideoTitle = styled(Typography)`
  /* 1rem in original YouTube in 10px */
  && {
    font-size: 14px;
    line-height: 20px;
    max-height: 40px;
    font-weight: 600;
    max-height: 40px;
    margin-bottom: 3px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      margin-bottom: 6px;
    }
  }
`

export const StyledAvatar = styled(Avatar)`
  &&& {
    cursor: pointer;
    width: 40px;
    height: 40px;
    margin-top: 4px;
    margin-left: 8px;

    @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
      width: 36px;
      height: 36px;
      background-color: #000000;
    }
  }
`
