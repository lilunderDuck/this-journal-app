import { ContextMenuSubTriggerProps, SubTrigger } from "@kobalte/core/context-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import stylex from "@stylexjs/stylex"
import { ParentProps, splitProps, ValidComponent } from "solid-js"
import { mergeClassname } from "~/utils"
import { FlexCenterY, Spacer } from "../Flex"

const style = stylex.create({
  menuSubContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    fontSize: "0.875rem",
    userSelect: 'none'
  },
  icon: {
    width: 15,
    height: 15
  }
})

export interface IContextMenuSubTriggerProps<
  T extends ValidComponent = "div"
> extends ContextMenuSubTriggerProps<T>, ParentProps {
  class?: string | undefined
} 
// ...

export function ContextMenuSubTrigger<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuSubTriggerProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuSubTriggerProps, ["class", "children"])
  return (
    <SubTrigger
      class={mergeClassname(
        props,
        stylex.attrs(style.menuSubContent)
      )}
      {...rest}
    >
      <FlexCenterY>
        {props.children}
        <Spacer />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          {...stylex.attrs(style.icon)}
        >
          <path d="M9 6l6 6l-6 6" />
        </svg>
      </FlexCenterY>
    </SubTrigger>
  )
}