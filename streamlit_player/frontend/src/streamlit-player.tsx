import {
  Streamlit,
  ComponentProps,
  withStreamlitConnection
} from "streamlit-component-lib"
import React, { useEffect, useState } from "react"

import ReactPlayer from "react-player"
import HeightObserver from "./height-observer"

const StreamlitPlayer = ({ args }: ComponentProps) => {
  const [playerEvents, setPlayerEvents] = useState({})

  // Handle events
  useEffect(() => {
    let events: any = {}

    args.events.forEach((name: string) => {
      events[name] = (data?: any) => {
        Streamlit.setComponentValue({
          name: name,
          data: data
        })
      }
    })

    setPlayerEvents(events)
  }, [args.events])

  return (
    <HeightObserver onChange={Streamlit.setFrameHeight} fixedHeight={args.height}>
      <ReactPlayer
        url={args.url}
        width="100%"
        height={args.height || undefined}
        playing={args.playing || undefined}
        loop={args.loop || undefined}
        controls={args.controls || undefined}
        light={args.light || undefined}
        volume={args.volume}
        muted={args.muted || undefined}
        playbackRate={args.playbackRate}
        progressInterval={args.progressInterval}
        playsinline={args.playInline || undefined}
        config={args.config || undefined}
        {...playerEvents}
      />
    </HeightObserver>
  )
}

export default withStreamlitConnection(StreamlitPlayer)
