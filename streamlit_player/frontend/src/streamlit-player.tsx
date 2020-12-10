import {
  Streamlit,
  ComponentProps,
  withStreamlitConnection
} from "streamlit-component-lib";
import React, { useEffect, useRef, useState } from "react"

import ReactPlayer from "react-player"
import ResizeObserver from "resize-observer-polyfill"

const StreamlitPlayer = ({ args }: ComponentProps) => {
  const [playerEvents, setPlayerEvents] = useState({})
  const divRef = useRef<HTMLDivElement>(null)

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

  // Handle height
  useEffect(() => {
    Streamlit.setFrameHeight(args.options.height)

    // Auto resize if no height is defined
    if (!args.options.height) {
      const ro = new ResizeObserver(() => {
        Streamlit.setFrameHeight()
      })

      if (divRef.current) {
        ro.observe(divRef.current)
      }

      return () => ro.disconnect()
    }
  }, [args.options.height])

  return (
    <div ref={divRef}>
      <ReactPlayer
        url={args.url}
        width="100%"
        {...playerEvents}
        {...args.options}
      />
    </div>
  )
}

export default withStreamlitConnection(StreamlitPlayer)
