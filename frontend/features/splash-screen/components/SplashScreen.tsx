import { createSignal, onMount, Show } from "solid-js"
import { Transition } from "solid-transition-group"
// ...
import { FlexCenter, FlexCenterX } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./SplashScreen.module.css"
import cat_jumping from "../assets/cat_jumping.gif"
// ...
import SplashText from "./SplashText"
import SplashProgressBar from "./SplashProgressBar"
import { useSplashScreenContext } from "../provider"

const style = stylex.create({
  screen: {
    width: '100%',
    height: '100%',
    userSelect: 'none',
    backgroundColor: 'var(--app-background-color)',
    position: 'fixed',
    zIndex: 1337
  },
  text: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30
  },
  iconHolder: {
    width: '100%',
    height: '100%',
  },
  icon: {
    marginLeft: '5.5rem',
    width: '20rem',
    height: '20rem',
    background: 'center center no-repeat var(--bg)',
    backgroundSize: 'contain'
  },
  topText: {
    width: '100%',
    position: 'absolute',
    marginTop: 5,
    marginLeft: 2,
    fontSize: 13
  }
})

export function SplashScreen() {
  const { isVisible$, progress$, topText$, start$, setIsVisible$ } = useSplashScreenContext()

  onMount(start$)

  return (
    <Transition 
      onExit={(el, done) => {
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 })
        a.finished.then(done)
      }}
    >
      {void setIsVisible$(start$.loading)}
      <Show when={isVisible$()}>
        <FlexCenterX {...stylex.attrs(style.screen)}>
          <SplashProgressBar style={{
            '--progress': `${progress$()}%`
          }} />
          <div {...stylex.attrs(style.topText)}>
            {topText$()}
          </div>
          <FlexCenter {...stylex.attrs(style.iconHolder)}>
            <div {...stylex.attrs(style.icon)} style={{
              '--bg': `url('${cat_jumping}')`
            }} />
          </FlexCenter>
          <SplashText {...stylex.attrs(style.text)} />
        </FlexCenterX>
      </Show>
    </Transition>
  )
}