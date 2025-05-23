import { splitProps, type ValidComponent } from "solid-js"
import { ContextMenuGroupLabelProps, GroupLabel } from "@kobalte/core/context-menu"
import { PolymorphicProps } from "@kobalte/core/polymorphic"
import { mergeClassname } from "~/utils"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menuGroupLabel: {
    paddingBlock: '0.375rem',
    paddingInline: '0.5rem',
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    fontWeight: 600
  },
})

export interface IContextMenuGroupLabelProps<T extends ValidComponent = "span"> extends ContextMenuGroupLabelProps<T> {
  class?: string | undefined
}

export function ContextMenuGroupLabel<T extends ValidComponent = "span">(
  props: PolymorphicProps<T, IContextMenuGroupLabelProps<T>>
) {
  const [, rest] = splitProps(props as IContextMenuGroupLabelProps, ["class"])
  return (
    <GroupLabel
      class={mergeClassname(
        props,
        stylex.attrs(style.menuGroupLabel)
      )}
      {...rest}
    />
  )
}