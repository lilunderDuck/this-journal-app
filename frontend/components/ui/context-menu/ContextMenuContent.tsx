import { splitProps, type ValidComponent } from "solid-js"
import { Content, Portal, type ContextMenuContentProps } from "@kobalte/core/context-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuContent: {
    overflow: "hidden",
    zIndex: 50,
    padding: "0.25rem",
    borderRadius: "0.375rem",
    backgroundColor: 'var(--gray3)',
  }
})

export interface IContextMenuContentProps<T extends ValidComponent = "div"> extends ContextMenuContentProps<T> {
  class?: string | undefined
}

export function ContextMenuContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, IContextMenuContentProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuContentProps, ["class"])
  return (
    <Portal>
      <Content
        class={mergeClassname(
          props,
          stylex.attrs(style.menuContent)
        )}
        {...rest}
      />
    </Portal>
  )
}