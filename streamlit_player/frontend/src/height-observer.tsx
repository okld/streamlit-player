import ResizeObserver from "resize-observer-polyfill"
import React, { useEffect, useRef } from "react"

interface HeightObserverProps {
  children?: any
  fixedHeight?: number
  onChange: (height: number) => void
}

const HeightObserver = ({ children, fixedHeight, onChange }: HeightObserverProps) => {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize height
    onChange(fixedHeight || document.body.scrollHeight)

    // Change height dynamically if fixedHeight is not set
    if (!fixedHeight && divRef.current) {

      // Call onChange with new height as parameter
      const ro = new ResizeObserver(entries => {
        const entry = entries.find(entry => entry.target === divRef.current)
        if (entry) {
          onChange(entry.contentRect.height)
        }
      })

      // Start observing div height changes
      ro.observe(divRef.current)

      // Unobserve div on unmount
      return () => ro.disconnect()
    }
  }, [fixedHeight, onChange])

  return (
    <div ref={divRef}>
      {children}
    </div>
  )
}

export default HeightObserver
