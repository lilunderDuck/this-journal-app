import { Match, Switch } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { IconTheme, Renderable, ToastType } from "../util"
import { Error, Loader, Success } from '.'

const style = stylex.create({
  iconContainer: {
    flexShrink: 0,
    minWidth: 20,
    minHeight: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  }
})

interface IIconContainerProps {
  icon?: Renderable
  theme?: IconTheme
  type: ToastType
}

export function ToastIconContainer(props: IIconContainerProps) {
  return (
    <div {...props} {...stylex.attrs(style.iconContainer)}>
      <Switch>
        <Match when={props.icon}>
          {props.icon}
        </Match>
        <Match when={props.type === 'loading'}>
          <Loader {...props.theme} />
        </Match>
        <Match when={props.type === 'success'}>
          <Success {...props.theme} />
        </Match>
        <Match when={props.type === 'error'}>
          <Error {...props.theme} />
        </Match>
      </Switch>
    </div>
  )
}