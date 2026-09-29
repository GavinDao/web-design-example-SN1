import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import Aurora from './components/Aurora'
import BlurText from './components/BlurText'
import Galaxy from './components/Galaxy'
import SplashCursor from './components/SplashCursor'
import SpecularButton from './components/SpecularButton'
import TechText from './components/TechText'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
}

function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function ArrowLink({
  href,
  children,
  secondary = false,
}: {
  href: string
  children: ReactNode
  secondary?: boolean
}) {
  return (
    <SpecularButton
      href={href}
      size="md"
      radius={999}
      tint={secondary ? '#141414' : '#d94b32'}
      tintOpacity={secondary ? 0.7 : 0.92}
      blur={secondary ? 10 : 4}
      textColor="#f3f6f7"
      lineColor={secondary ? '#f3f6f7' : '#ffb09f'}
      baseColor={secondary ? '#51565a' : '#7a2d20'}
      intensity={1.15}
      shineSize={13}
      shineFade={46}
      thickness={1.2}
      proximity={220}
      className={`button ${secondary ? 'button--secondary' : ''}`}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.8} />
    </SpecularButton>
  )
}

function AnimatedHeading({ text, className = '' }: { text: string; className?: string }) {
  return (
    <BlurText
      as="h2"
      text={text}
      className={className}
      animateBy="words"
      direction="bottom"
      delay={65}
      stepDuration={0.42}
    />
  )
}

function AnimatedCopy({ text, as = 'p', className = '' }: { text: string; as?: 'p' | 'h3'; className?: string }) {
  if (as === 'p') {
    return (
      <motion.p
        className={className}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {text}
      </motion.p>
    )
  }

  return (
    <BlurText
      as={as}
      text={text}
      className={className}
      animateBy="words"
      direction="bottom"
      delay={42}
      stepDuration={0.34}
    />
  )
}

function MagneticPortrait() {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 120, damping: 18, mass: 0.35 })
  const springY = useSpring(y, { stiffness: 120, damping: 18, mass: 0.35 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!ref.current || window.matchMedia('(pointer: coarse)').matches) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distance = Math.hypot(event.clientX - centerX, event.clientY - centerY)

      if (distance > Math.max(rect.width, rect.height) * 0.9) {
        x.set(0)
        y.set(0)
        return
      }

      x.set(Math.max(-26, Math.min(26, (event.clientX - centerX) * 0.08)))
      y.set(Math.max(-20, Math.min(20, (event.clientY - centerY) * 0.06)))
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return (
    <div className="portrait-stage" ref={ref}>
      <div className="portrait-halo" aria-hidden="true" />
      <motion.img
        className="portrait-image"
        src="/assets/dddao-avatar.png"
        alt="DDDAO 的 3D 角色头像"
        style={{ x: springX, y: springY }}
        draggable={false}
        loading="eager"
      />
    </div>
  )
}

const projects = [
  {
    number: '01',
    title: 'Lunar Recovery',
    category: 'Recovery tech · Product vision',
    year: '2026',
    description:
      'A precision recovery tool imagined for zero-gravity rituals, pairing tactile control with a deep-space material language.',
    image: '/assets/work-lunar-recovery.webp',
    objectPosition: 'center 55%',
    accent: '#817dbe',
    surface: '#e8e8f0',
    ink: '#14141d',
  },
  {
    number: '02',
    title: 'Air Silver',
    category: 'Personal audio · Concept',
    year: '2026',
    description:
      'A soft-metal audio object shaped around calm surfaces, quiet precision and a deliberately weightless presence.',
    image: '/assets/work-air-silver.webp',
    objectPosition: 'center 68%',
    accent: '#a9b1bb',
    surface: '#f1f3f4',
    ink: '#181c20',
  },
  {
    number: '03',
    title: 'Orbit Camera',
    category: 'Action camera · Product vision',
    year: '2026',
    description:
      'A rugged image-making tool suspended between terrain and atmosphere, with cinematic optics and restrained red cues.',
    image: '/assets/work-orbit-camera.webp',
    objectPosition: 'center center',
    accent: '#d43f36',
    surface: '#e6e7e8',
    ink: '#111315',
  },
  {
    number: '04',
    title: 'Clear Signal',
    category: 'Transparent camera · Concept',
    year: '2026',
    description:
      'A transparent camera study that exposes its internal architecture and turns every functional layer into visual identity.',
    image: '/assets/work-clear-signal.webp',
    objectPosition: 'center 48%',
    accent: '#e84d62',
    surface: '#dce7ec',
    ink: '#15222a',
  },
]

const capabilities = [
  ['3D Direction', 'Characters, objects and visual worlds with a clear art direction.'],
  ['Motion Design', 'Short-form motion systems designed for launches, campaigns and screens.'],
  ['Brand Visuals', 'Distinct visual identities shaped through image, type, material and rhythm.'],
  ['Interactive Web', 'Responsive portfolio and campaign experiences where motion supports the story.'],
]

const labImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
]

function Header() {
  return (
    <header className="site-header">
      <nav className="container nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="DDDAO 首页">
          DDDAO<span className="brand-dot">.</span>
        </a>
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#capabilities">Capabilities</a>
        </div>
        <SpecularButton
          href="#contact"
          size="sm"
          radius={999}
          tint="#e3e8eb"
          tintOpacity={0.96}
          textColor="#111111"
          lineColor="#ffffff"
          baseColor="#8e9397"
          intensity={1.15}
          proximity={180}
          className="nav-contact"
        >
          Let&apos;s talk
        </SpecularButton>
      </nav>
    </header>
  )
}

function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const easedProgress = useSpring(scrollYProgress, { stiffness: 72, damping: 24, mass: 0.55 })
  const foregroundOpacity = useTransform(easedProgress, [0, 0.12, 0.32], [1, 0.96, 0])
  const foregroundY = useTransform(easedProgress, [0, 0.34], [0, -34])
  const portraitScale = useTransform(easedProgress, [0, 1], [1, 1.24])

  return (
    <section className="hero-scroll" id="top" ref={sectionRef}>
      <div className="hero">
        <div className="hero-galaxy" aria-hidden="true">
          <Galaxy
            focal={[0.5, 0.42]}
            rotation={[1, 0.08]}
            starSpeed={0.35}
            density={1.15}
            hueShift={12}
            speed={0.6}
            glowIntensity={0.18}
            saturation={0.42}
            twinkleIntensity={0.22}
            rotationSpeed={0.025}
            mouseInteraction={false}
            mouseRepulsion={false}
            transparent
          />
        </div>
        <div className="hero-aurora" aria-hidden="true">
          <Aurora
            colorStops={['#3a041e', '#7a2f16', '#1c0967']}
            blend={0.58}
            amplitude={1.05}
            speed={0.35}
          />
        </div>
        <div className="hero-interface">
          <motion.div className="hero-header-fade" style={{ opacity: foregroundOpacity, y: foregroundY }}>
            <Header />
          </motion.div>
          <div className="hero-grid container">
        <motion.div className="hero-heading" style={{ opacity: foregroundOpacity, y: foregroundY }}>
          <Reveal>
            <p className="eyebrow">Independent 3D creator · Visual designer</p>
          </Reveal>

          <motion.div
            className="hero-title-wrap"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="sr-only">DDDAO</h1>
            <TechText
              text="DDDAO"
              fontFamily="Kanit"
              fontWeight={900}
              fontSize={240}
              letterSpacing={-0.075}
              color="#dce4e9"
              accentColor="#d94b32"
              reveal="letter"
              reach={190}
              dashLength={6}
              dashGap={3}
              strokeWidth={1.5}
              specks={12}
              selection
              labels
              draggable
              sweep
              speed={0.75}
              className="hero-tech-text"
              style={{}}
            />
          </motion.div>

          <Reveal delay={0.08}>
            <BlurText
              as="p"
              className="hero-statement"
              text="Characters in motion, ideas with shape."
              animateBy="words"
              direction="bottom"
              delay={90}
              stepDuration={0.48}
            />
            <AnimatedCopy
              className="hero-description"
              text="DDDAO creates expressive 3D characters, motion systems and digital experiences for bold brands."
            />
            <div className="hero-actions">
              <ArrowLink href="#work">View selected work</ArrowLink>
              <ArrowLink href="#about" secondary>
                Meet DDDAO
              </ArrowLink>
            </div>
          </Reveal>
        </motion.div>

            <div className="hero-visual-shell">
              <motion.div className="hero-portrait-parallax" style={{ scale: portraitScale }}>
                <Reveal className="hero-visual" delay={0.16}>
                  <MagneticPortrait />
                </Reveal>
              </motion.div>
            </div>

            <motion.aside className="hero-float-card hero-float-card--left" style={{ opacity: foregroundOpacity, y: foregroundY, rotate: -3.5 }}>
              <span>01 · Character</span>
              <strong>3D with a point of view.</strong>
              <p>Built to be recognised, not just rendered.</p>
            </motion.aside>

            <motion.aside className="hero-float-card hero-float-card--right" style={{ opacity: foregroundOpacity, y: foregroundY, rotate: 3.5 }}>
              <span>02 · Motion</span>
              <strong>Ideas made to move.</strong>
              <p>Visual systems that travel across screens.</p>
            </motion.aside>

            <motion.div className="hero-meta" style={{ opacity: foregroundOpacity }}>
              <span>Working worldwide · 2026</span>
              <span>Less noise. More character.</span>
            </motion.div>
          </div>
        </div>
        <motion.div className="hero-scroll-cue" aria-hidden="true" style={{ opacity: foregroundOpacity }}>
          <span>Scroll to explore</span>
          <i />
        </motion.div>
      </div>
    </section>
  )
}

function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollDistance, setScrollDistance] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 26, mass: 0.5 })
  const trackX = useTransform(smoothProgress, [0, 1], [0, -scrollDistance])
  const progressScale = useTransform(smoothProgress, [0, 1], [0, 1])

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current || !viewportRef.current) return
      setScrollDistance(Math.max(0, trackRef.current.scrollWidth - viewportRef.current.clientWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (trackRef.current) observer.observe(trackRef.current)
    if (viewportRef.current) observer.observe(viewportRef.current)
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const sectionHeight = `calc(100svh + ${Math.max(scrollDistance * 1.18, 2600)}px)`

  return (
    <section className="work-scroll" id="work" ref={sectionRef} style={{ height: sectionHeight }}>
      <div className="work-sticky" ref={viewportRef}>
        <motion.div className="work-track" ref={trackRef} style={{ x: trackX }}>
          <article className="work-intro-panel">
            <p className="eyebrow">01 · Selected work</p>
            <AnimatedHeading text="Projects with a point of view." />
            <AnimatedCopy text="A horizontal reel of identity, 3D and motion work—scroll down to move through the projects." />
            <div className="work-direction" aria-hidden="true">
              <span>Scroll to move sideways</span>
              <ArrowUpRight size={18} />
            </div>
          </article>
          {projects.map((project, index) => (
            <article
              className="project-card work-panel"
              key={project.title}
              style={{
                '--project-accent': project.accent,
                '--project-surface': project.surface,
                '--project-ink': project.ink,
              } as CSSProperties}
            >
              <div className="project-visual">
                <img
                  src={project.image}
                  alt={`${project.title} 项目视觉`}
                  loading="lazy"
                  style={{ objectPosition: project.objectPosition }}
                />
                <span className="project-number">{project.number}</span>
              </div>
              <div className="project-copy">
                <div className="project-kicker">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                </div>
                <span className="work-index">
                  {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
                <AnimatedCopy as="h3" text={project.title} />
                <AnimatedCopy text={project.description} />
                <a className="text-link" href="#contact">
                  View project <ArrowUpRight aria-hidden="true" size={17} />
                </a>
              </div>
            </article>
          ))}
          <div className="work-end" aria-hidden="true">
            <span>That&apos;s the reel</span>
            <strong>Keep scrolling ↓</strong>
          </div>
        </motion.div>
        <div className="work-progress" aria-hidden="true">
          <motion.span style={{ scaleX: progressScale }} />
        </div>
      </div>
    </section>
  )
}

function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const wordX = useTransform(scrollYProgress, [0, 1], ['6%', '-18%'])

  return (
    <section className="section about-section" id="about" ref={sectionRef}>
      <motion.p className="about-watermark" aria-hidden="true" style={{ x: wordX }}>
        CURIOUS BY DEFAULT
      </motion.p>
      <div className="container about-grid">
        <Reveal>
          <p className="eyebrow">02 · About</p>
          <AnimatedHeading text="I turn rough ideas into images people can feel." />
        </Reveal>
        <Reveal className="about-copy" delay={0.08}>
          <AnimatedCopy className="about-lead" text="DDDAO is an independent creator working between 3D art, motion and interactive design." />
          <AnimatedCopy text="My process starts with the message, then builds the visual language around it—from character and material studies to the final moving system. The goal is simple: make the work distinctive without making it difficult to understand." />
          <div className="about-facts">
            <div>
              <strong>05+</strong>
              <span>Years creating</span>
            </div>
            <div>
              <strong>04</strong>
              <span>Core disciplines</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Things to explore</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Capabilities() {
  return (
    <section className="section capabilities-section" id="capabilities">
      <div className="container capabilities-grid">
        <Reveal className="capabilities-intro">
          <p className="eyebrow">03 · Capabilities</p>
          <AnimatedHeading text="From the first sketch to the final frame." />
          <AnimatedCopy text="I work across disciplines, but every decision belongs to one visual system." />
        </Reveal>
        <div className="capability-list">
          {capabilities.map(([title, description], index) => (
            <Reveal key={title} delay={index * 0.05}>
              <article className="capability-item">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <AnimatedCopy as="h3" text={title} />
                <AnimatedCopy text={description} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  const steps = [
    ['Frame the idea', 'Clarify the audience, message and one thing the work must make people remember.'],
    ['Build the language', 'Explore form, type, material, light and motion until the system feels coherent.'],
    ['Make it travel', 'Adapt the final direction across the formats and moments where it needs to perform.'],
  ]

  return (
    <section className="section process-section">
      <div className="container">
        <Reveal className="section-heading process-heading">
          <div>
            <p className="eyebrow">04 · Process</p>
            <AnimatedHeading text="Clear thinking. Expressive output." />
          </div>
          <AnimatedCopy text="A compact process that leaves room for exploration without losing the brief." />
        </Reveal>
        <div className="process-grid">
          {steps.map(([title, description], index) => (
            <Reveal key={title} delay={index * 0.08}>
              <article className="process-step">
                <span>0{index + 1}</span>
                <AnimatedCopy as="h3" text={title} />
                <AnimatedCopy text={description} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Playground() {
  return (
    <section className="section playground-section">
      <div className="container playground-heading">
        <Reveal>
          <p className="eyebrow">05 · Playground</p>
          <AnimatedHeading text="Tests, loops and happy accidents." />
        </Reveal>
        <Reveal delay={0.08}>
          <AnimatedCopy text="Personal studies keep the commercial work sharp. This is where new materials, movement and compositions begin." />
        </Reveal>
      </div>
      <div className="playground-track" aria-label="Experimental visual studies">
        {labImages.map((image, index) => (
          <figure className="lab-card" key={image}>
            <img src={image} alt={`DDDAO 实验视觉 ${index + 1}`} loading="lazy" />
            <figcaption>Study {String(index + 1).padStart(2, '0')}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer className="contact-section" id="contact">
      <div className="container contact-grid">
        <Reveal>
          <p className="eyebrow">Have a project in mind?</p>
          <AnimatedHeading text="Let's make something with character." />
        </Reveal>
        <Reveal className="contact-action" delay={0.08}>
          <AnimatedCopy text="Available for selected 3D, motion, identity and interactive projects." />
          <ArrowLink href="mailto:hello@dddao.design">Start a conversation</ArrowLink>
        </Reveal>
      </div>
      <div className="container footer-row">
        <span>© 2026 DDDAO</span>
        <span>Independent 3D creator · Visual designer</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <main>
      <SplashCursor
        SIM_RESOLUTION={96}
        DYE_RESOLUTION={512}
        DENSITY_DISSIPATION={12}
        VELOCITY_DISSIPATION={10}
        PRESSURE={0.9}
        CURL={5}
        SPLAT_RADIUS={0.075}
        SPLAT_FORCE={4200}
        COLOR_UPDATE_SPEED={2}
        SHADING={false}
        RAINBOW_MODE={false}
        COLOR="#d94b32"
        OPACITY={0.3}
        TRANSPARENT
      />
      <Hero />
      <SelectedWork />
      <About />
      <Capabilities />
      <Process />
      <Playground />
      <Contact />
    </main>
  )
}
