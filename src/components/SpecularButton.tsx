import { MouseEventHandler, ReactNode, useEffect, useRef } from 'react'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import './SpecularButton.css'

const PAD = 20
const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position=vec4(position,0.0,1.0); }`
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uCenter; uniform vec2 uHalfSize; uniform float uRadius; uniform float uAngle;
uniform float uPx; uniform vec3 uLineColor; uniform vec3 uBaseColor; uniform float uIntensity;
uniform float uShineSize; uniform float uShineFade; uniform float uThickness; uniform float uBaseWidth;
out vec4 fragColor;
float sdRoundedRect(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}
float gaussianLine(float d,float sigma){float x=d/(sigma+1e-6);float k=mix(1.0,1.6,smoothstep(0.0,1.5,x));return exp(-k*x*x);}
void main(){
 vec2 p=gl_FragCoord.xy-uCenter; float d=sdRoundedRect(p,uHalfSize,uRadius); vec2 L=vec2(cos(uAngle),sin(uAngle));
 float base=(1.0-smoothstep(0.0,uBaseWidth,abs(d)))*0.45;
 vec2 nEll=normalize(p/(uHalfSize*uHalfSize)+1e-6); float phi=acos(clamp(abs(dot(nEll,L)),0.0,1.0));
 float rim=1.0-smoothstep(uShineSize-uShineFade,uShineSize+uShineFade+1e-4,phi);
 float line=gaussianLine(d,uThickness); float edgeClamp=1.0-smoothstep(0.5*uPx,3.0*uPx,abs(d));
 float hi=line*rim*edgeClamp*uIntensity; vec3 col=uBaseColor*base+uLineColor*hi;
 fragColor=vec4(col,clamp(base+hi,0.0,1.0));
}`

type Props = {
  children?: ReactNode; size?: 'sm' | 'md' | 'lg'; radius?: number; tint?: string; tintOpacity?: number
  blur?: number; textColor?: string; lineColor?: string; baseColor?: string; intensity?: number
  shineSize?: number; shineFade?: number; thickness?: number; speed?: number; followMouse?: boolean
  proximity?: number; autoAnimate?: boolean; disabled?: boolean; onClick?: MouseEventHandler<HTMLElement>
  className?: string; type?: 'button' | 'submit' | 'reset'; href?: string
}

export default function SpecularButton({
  children='Get Started', size='lg', radius=18, tint='#ffffff', tintOpacity=0, blur=0,
  textColor='#f5f5f5', lineColor='#ffffff', baseColor='#525252', intensity=1,
  shineSize=10, shineFade=40, thickness=1, speed=.35, followMouse=true, proximity=250,
  autoAnimate=false, disabled=false, onClick, className='', type='button', href,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null)
  const fxRef = useRef<HTMLSpanElement>(null)
  const propsRef = useRef({ radius,lineColor,baseColor,intensity,shineSize,shineFade,thickness,speed,followMouse,proximity,autoAnimate })
  propsRef.current={ radius,lineColor,baseColor,intensity,shineSize,shineFade,thickness,speed,followMouse,proximity,autoAnimate }

  useEffect(() => {
    const button=buttonRef.current, fx=fxRef.current
    if(!button||!fx) return
    const dpr=window.devicePixelRatio||1
    const renderer=new Renderer({alpha:true,premultipliedAlpha:true,antialias:true,dpr})
    const gl=renderer.gl
    gl.clearColor(0,0,0,0); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA)
    const geometry=new Triangle(gl); if(geometry.attributes.uv) delete geometry.attributes.uv
    const program=new Program(gl,{vertex:VERT,fragment:FRAG,uniforms:{
      uCenter:{value:[0,0]},uHalfSize:{value:[1,1]},uRadius:{value:0},uAngle:{value:2.4},uPx:{value:dpr},
      uLineColor:{value:[1,1,1]},uBaseColor:{value:[.32,.32,.32]},uIntensity:{value:1},
      uShineSize:{value:.17},uShineFade:{value:.7},uThickness:{value:1},uBaseWidth:{value:dpr},
    }})
    const mesh=new Mesh(gl,{geometry,program}); fx.appendChild(gl.canvas)
    const dimensions={w:1,h:1}
    const resize=()=>{const rect=button.getBoundingClientRect();dimensions.w=rect.width;dimensions.h=rect.height;renderer.setSize(rect.width+PAD*2,rect.height+PAD*2);program.uniforms.uCenter.value=[(PAD+rect.width/2)*dpr,(PAD+rect.height/2)*dpr];program.uniforms.uHalfSize.value=[rect.width/2*dpr,rect.height/2*dpr]}
    const observer=new ResizeObserver(resize);observer.observe(button);resize()
    let isVisible=true
    const visibilityObserver=new IntersectionObserver(([entry])=>{isVisible=entry.isIntersecting},{rootMargin:'100px'})
    visibilityObserver.observe(button)
    let pointerAngle:number|null=null, proximityT=0
    const pointerMove=(event:PointerEvent)=>{const rect=button.getBoundingClientRect();const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;const dx=Math.max(rect.left-event.clientX,0,event.clientX-rect.right);const dy=Math.max(rect.top-event.clientY,0,event.clientY-rect.bottom);const distance=Math.hypot(dx,dy);pointerAngle=distance===0?Math.atan2(2/rect.height,-2/rect.width)+(event.clientX-cx)/(rect.width/2)*.3+(cy-event.clientY)/(rect.height/2)*.15:Math.atan2(cy-event.clientY,event.clientX-cx);const t=Math.max(0,1-distance/Math.max(propsRef.current.proximity,1));proximityT=t*t*(3-2*t)}
    window.addEventListener('pointermove',pointerMove,{passive:true})
    let angle=2.4,idleAngle=2.4,bright=0,last=performance.now(),frame=0
    const lineColorValue=new Color(),baseColorValue=new Color()
    const update=(now:number)=>{frame=requestAnimationFrame(update);const dt=Math.min((now-last)/1000,.05);last=now;if(!isVisible||document.hidden)return;const p=propsRef.current;idleAngle+=p.speed*dt;const steer=p.followMouse&&pointerAngle!==null&&(!p.autoAnimate||proximityT>0);const target=steer?pointerAngle!:idleAngle;const diff=((target-angle+Math.PI*3)%(Math.PI*2))-Math.PI;angle+=diff*(1-Math.exp(-dt*7));const brightTarget=p.autoAnimate?1:proximityT;bright+=(brightTarget-bright)*(1-Math.exp(-dt*8));lineColorValue.set(p.lineColor);baseColorValue.set(p.baseColor);program.uniforms.uAngle.value=angle;program.uniforms.uRadius.value=Math.min(p.radius,Math.min(dimensions.w,dimensions.h)/2)*dpr;program.uniforms.uLineColor.value=[lineColorValue.r,lineColorValue.g,lineColorValue.b];program.uniforms.uBaseColor.value=[baseColorValue.r,baseColorValue.g,baseColorValue.b];program.uniforms.uIntensity.value=p.intensity*bright;program.uniforms.uShineSize.value=p.shineSize*Math.PI/180;program.uniforms.uShineFade.value=p.shineFade*Math.PI/180;program.uniforms.uThickness.value=p.thickness*dpr;renderer.render({scene:mesh})}
    frame=requestAnimationFrame(update)
    return()=>{cancelAnimationFrame(frame);observer.disconnect();visibilityObserver.disconnect();window.removeEventListener('pointermove',pointerMove);if(gl.canvas.parentNode===fx)fx.removeChild(gl.canvas);gl.getExtension('WEBGL_lose_context')?.loseContext()}
  },[])

  const commonProps = {
    ref: buttonRef,
    onClick,
    className:`specular-button specular-button--${size}${className?` ${className}`:''}`,
    style:{'--sb-radius':`${radius}px`,'--sb-tint':tint,'--sb-tint-opacity':tintOpacity,'--sb-blur':`${blur}px`,'--sb-text-color':textColor} as React.CSSProperties,
  }
  const content=<><span ref={fxRef} className="specular-button__fx" aria-hidden="true"/><span className="specular-button__label">{children}</span></>
  return href
    ? <a {...commonProps} href={href} aria-disabled={disabled || undefined}>{content}</a>
    : <button {...commonProps} type={type} disabled={disabled}>{content}</button>
}
