import { motion } from 'motion/react'
import { ElementType, useEffect, useMemo, useRef, useState } from 'react'

type Snapshot = Record<string, string | number>

type BlurTextProps = {
  text?: string
  as?: ElementType
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  threshold?: number
  rootMargin?: string
  animationFrom?: Snapshot
  animationTo?: Snapshot[]
  easing?: (value: number) => number
  onAnimationComplete?: () => void
  stepDuration?: number
}

const buildKeyframes = (from: Snapshot, steps: Snapshot[]) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap(step => Object.keys(step))])
  const keyframes: Record<string, Array<string | number>> = {}
  keys.forEach(key => {
    const fallback = from[key] ?? steps.find(step => step[key] !== undefined)?.[key] ?? 0
    keyframes[key] = [fallback, ...steps.map(step => step[key] ?? fallback)]
  })
  return keyframes
}

export default function BlurText({
  text = '',
  as: Component = 'p',
  delay = 70,
  className = '',
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = value => value,
  onAnimationComplete,
  stepDuration = 0.4,
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : [...text]
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.unobserve(element)
      }
    }, { threshold, rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const defaultFrom = useMemo<Snapshot>(() => ({
    filter: 'blur(6px)',
    opacity: 0,
    y: direction === 'top' ? -18 : 18,
  }), [direction])

  const defaultTo = useMemo<Snapshot[]>(() => [
    { filter: 'blur(2px)', opacity: 0.65, y: direction === 'top' ? 3 : -3 },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ], [direction])

  const fromSnapshot = animationFrom ?? defaultFrom
  const toSnapshots = animationTo ?? defaultTo
  const keyframes = buildKeyframes(fromSnapshot, toSnapshots)
  const stepCount = toSnapshots.length + 1
  const totalDuration = stepDuration * (stepCount - 1)
  const times = Array.from({ length: stepCount }, (_, index) => stepCount === 1 ? 0 : index / (stepCount - 1))

  return (
    <Component
      ref={(node: HTMLElement | null) => { ref.current = node }}
      className={`blur-text ${className}`.trim()}
      style={{ display: 'flex', flexWrap: 'wrap' }}
    >
      {elements.map((segment, index) => (
        <motion.span
          className="blur-text__segment"
          key={`${segment}-${index}`}
          initial={fromSnapshot}
          animate={inView ? keyframes : fromSnapshot}
          transition={{
            duration: totalDuration,
            times,
            delay: (index * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </Component>
  )
}
