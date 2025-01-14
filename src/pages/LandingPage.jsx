import React, { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { ThemeProvider } from '@material-ui/styles'
import { Grid } from '@material-ui/core'
import { columnBreakpoints } from '../components/Videos/columnBreakpoints'
import {
  useIsMobileView,
  TWO_COL_MIN_WIDTH,
  TWO_COL_MAX_WIDTH,
  THREE_COL_MIN_WIDTH,
  THREE_COL_MAX_WIDTH,
  FOUR_COL_MIN_WIDTH,
  FOUR_COL_MAX_WIDTH,
  SIX_COL_MIN_WIDTH,
  SIX_COL_MAX_WIDTH,
  MOBILE_VIEW_HEADER_HEIGHT,
  DESKTOP_VIEW_HEADER_HEIGHT,
  SHOW_MINI_SIDEBAR_BREAKPOINT,
  MINI_SIDEBAR_WIDTH,
  SHOW_FULL_SIDEBAR_BREAKPOINT,
  FULL_SIDEBAR_WIDTH,
} from '../utils/utils'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GridItem } from '../components/Videos/GridItem'
import { useAtom } from 'jotai'
import { userSettingToShowFullSidebarAtom } from '../store'
import videoData from './videoData.json';

const Videos = ({
  landingPageVideos,
  setLandingPageVideos,
  setPopularVideosNextPageToken,
}) => {
  const VIDEOS_PER_QUERY = 24
  const isMobileView = useIsMobileView()
  const [userSettingToShowFullSidebar] = useAtom(
    userSettingToShowFullSidebarAtom
  )

  // total number of videos returned by API query
  const [popularVideosTotalResults, setPopularVideosTotalResults] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const getPopularVideos = () => {
    try {
      setIsLoading(true)
      const data = videoData;
      setPopularVideosTotalResults(data.length)

      // infinite scroll needs previous page + current page data
      setLandingPageVideos(data)
      setPopularVideosNextPageToken(data.nextPageToken)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getPopularVideos()
  })

  let shouldGetMoreResults =
    (popularVideosTotalResults - landingPageVideos.length) / VIDEOS_PER_QUERY >=
    1

  return (
    <OuterVideoContainer
      showFullSidebar={userSettingToShowFullSidebar}
    >
      <ThemeProvider theme={columnBreakpoints}>
        <InnerVideoContainer>
          <InfiniteScroll
            dataLength={landingPageVideos.length}
            hasMore={shouldGetMoreResults}
            // overflow: auto from infinite scroll default causes scrolling problem
            style={{ overflow: 'unset' }}
          >
            {/* change from here if remove loading-skeleton */}
            <Grid container spacing={isMobileView ? 0 : 2}>
              {isLoading
                ? [...Array(VIDEOS_PER_QUERY)].map((_, index) => {
                    return <GridItem key={`skeleton-${index}`} />
                  })
                : landingPageVideos.map((video) => <GridItem key={video.personalization_id} video={video} />)}
            </Grid>
          </InfiniteScroll>
        </InnerVideoContainer>
      </ThemeProvider>
    </OuterVideoContainer>
  )
}

export default Videos

export const OuterVideoContainer = styled.div`
  width: 100%;
  padding-top: ${MOBILE_VIEW_HEADER_HEIGHT}px;

  /* 496px */
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    padding-top: ${DESKTOP_VIEW_HEADER_HEIGHT}px;
  }

  /* 792px */
  @media screen and (min-width: ${SHOW_MINI_SIDEBAR_BREAKPOINT}px) {
    padding-left: ${MINI_SIDEBAR_WIDTH}px;
  }

  /* 1313px */
  @media screen and (min-width: ${SHOW_FULL_SIDEBAR_BREAKPOINT}px) {
    padding-left: ${({ showFullSidebar }) =>
      showFullSidebar ? FULL_SIDEBAR_WIDTH : MINI_SIDEBAR_WIDTH}px;
  }
`

const InnerVideoContainer = styled.div`
  /* mobile view has 0 margin */
  margin: 0;
  @media screen and (min-width: ${TWO_COL_MIN_WIDTH}px) {
    max-width: ${TWO_COL_MAX_WIDTH}px;
    margin-top: 24px;
    margin-left: auto;
    margin-right: auto;
  }

  @media screen and (min-width: ${THREE_COL_MIN_WIDTH}px) {
    max-width: ${THREE_COL_MAX_WIDTH}px;
    // from 872 px up there's padding left and right
    padding-left: 16px;
    padding-right: 16px;
  }
  @media screen and (min-width: ${FOUR_COL_MIN_WIDTH}px) {
    max-width: ${FOUR_COL_MAX_WIDTH}px;
  }
  /* There's no five columns with MUI Grid 
  @media screen and (min-width: 1952px) {
    max-width: 1804px;
  } */
  @media screen and (min-width: ${SIX_COL_MIN_WIDTH}px) {
    max-width: ${SIX_COL_MAX_WIDTH}px;
  }
`
