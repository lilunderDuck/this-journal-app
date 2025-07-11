import { SolidNodeViewContextProps, useSolidNodeView, Attrs } from "./useSolidNodeView"
import { Ref } from "./ref"
import { Component, JSX, splitProps } from "solid-js"
import { Dynamic } from "solid-js/web"

export interface NodeViewWrapperProps {
  [key: string]: unknown
  style?: JSX.CSSProperties
  ref?: Ref<Element>
  as?: string | Component<Record<string, unknown>>
}

export function NodeViewWrapper(props: NodeViewWrapperProps) {
  const { state } = useSolidNodeView() as SolidNodeViewContextProps<Attrs>
  const [local, otherProps] = splitProps(props, ["ref"])

  return (
    <Dynamic
      {...otherProps}
      component={props.as || "div"}
      ref={local.ref ? local.ref[1] : null}
      data-node-view-wrapper="true"
      onDragStart={state().onDragStart}
      style={{
        ...props.style,
        whiteSpace: "normal"
      }}
    />
  )
}