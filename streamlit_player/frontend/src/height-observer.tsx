import React, { useCallback, useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

interface HeightObserverProps {
  children?: any
  fixedHeight?: number
  onChange: (height: number) => void
}

const HeightObserver = ({ children, fixedHeight, onChange }: HeightObserverProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const containerRef = (node: HTMLDivElement) => setContainer(node)

  const changeCallback = useCallback(onChange, [])

  useEffect(() => {
    // Initialize height
    changeCallback(fixedHeight || document.body.scrollHeight)

    // Change height dynamically if fixedHeight is not set
    if (!fixedHeight && container) {

      // Call onChange with new height as parameter
      const ro = new ResizeObserver(entries => {
        const entry = entries.find(entry => entry.target === container)
        if (entry) {
          changeCallback(entry.contentRect.height)
        }
      })

      // Start observing div height changes
      ro.observe(container)

      // Unobserve div on unmount
      return () => {
        ro.disconnect()
      }
    }
  }, [container, fixedHeight, changeCallback])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

export default HeightObserver
