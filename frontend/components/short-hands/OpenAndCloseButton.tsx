import stylex from "@stylexjs/stylex"
import { 
  Button, 
  ButtonSizeVariant,
  ButtonVariant, 
  Flex, 
  Spacer 
} from "../ui"
import { JSX, splitProps } from "solid-js"

const style = stylex.create({
  theThing: {
    gap: 15,
    marginTop: 15
  }
})

interface IOpenAndCloseButtonProps extends HTMLAttributes<"div"> {
  onClickingClose$?: () => any
  onClickingOpen$?: () => any
  openText$?: JSX.Element
  closeText$?: JSX.Element
  openButtonProps$?: HTMLAttributes<"button">
  closeButtonProps$?: HTMLAttributes<"button">
}

export function OpenAndCloseButton(props: IOpenAndCloseButtonProps) {
  const [stuff, divProps] = splitProps(props, [
    "onClickingClose$", 
    "onClickingOpen$", 
    "closeButtonProps$", 
    "openButtonProps$", 
    "closeText$", 
    "openText$"
  ])

  return (
    <Flex {...divProps} {...stylex.attrs(style.theThing)}>
      <Spacer />
      <Button 
        size$={ButtonSizeVariant.sm} 
        variant$={ButtonVariant.danger}
        onClick={props.onClickingClose$}
        {...stuff.closeButtonProps$}
      >
        {props.closeText$}
      </Button>
      <Button 
        size$={ButtonSizeVariant.sm} 
        onClick={props.onClickingOpen$}
        {...stuff.openButtonProps$}
      >
        {props.openText$}
      </Button>
    </Flex>
  )
}