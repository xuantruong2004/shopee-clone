import React, { ElementType, useRef, useState } from 'react'
// eslint-disable-next-line import/no-duplicates
import { useFloating, useHover, useInteractions, arrow, offset, shift, type Placement } from '@floating-ui/react'
// eslint-disable-next-line import/no-duplicates
import { FloatingPortal } from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  children: React.ReactNode
  className?: string
  renderPopover: React.ReactNode
  offSet?: number
  as?: ElementType
  placement?: Placement
}

export default function Popover({
  children,
  className,
  renderPopover,
  offSet,
  as: Element = 'div',
  placement = 'bottom-end'
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef<HTMLElement>(null)
  const { refs, context, middlewareData } = useFloating({
    middleware: [offset(offSet), shift(), arrow({ element: arrowRef })],
    placement: placement
  })
  const hover = useHover(context)

  const { getReferenceProps } = useInteractions([hover])

  return (
    <Element
      className={className}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      {children}
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={refs.setFloating}
              style={{
                position: context.strategy,
                top: context.y ?? 0,
                left: context.x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x}px top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
              transition={{ duration: 0.2 }}
            >
              <span
                ref={arrowRef}
                className=' absolute z-10 -translate-y-[95%] border-[11px] border-x-transparent border-b-white border-t-transparent'
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
              ></span>
              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </Element>
  )
}
