import { createEffect, createSignal, For, Show } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Editor.module.css"
import __scrollbarStyle from "~/assets/style/scrollbar.module.css"
// ...
import { type IBlockData, useEditorContext } from "../provider"
import { BlockButtonRow } from "../components"

const style = stylex.create({
  editor: {
    paddingInline: 10,
    maxHeight: 'calc(100vh - 60px)',
    paddingBottom: '20rem'
  },
  blockList: {
    width: '100%',
    height: '100%',
  }
})

export function Editor() {
  const { blocks$, blockSetting$, internal$, isReadonly$ } = useEditorContext()

  let scrollableElement!: Ref<"div">
  const moveTheButtonRow: EventHandler<"div", "onMouseEnter"> = (mouseEvent) => {
    const currentTarget = mouseEvent.currentTarget
    internal$.buttonRow$.updatePosition$(currentTarget)
  }

  const EditorBlock = (props: IBlockData) => {
    const BlockComponent = blockSetting$[props.type]?.blockComponent$
    if (!BlockComponent) {
      isDevMode && editorLog.warn("could not find block component for block type:", props)
      return undefined
    }
  
    return (
      <Show when={isReadonly$()} fallback={
        <div id={__style.block} data-id={props.id} onMouseEnter={moveTheButtonRow}>
          <BlockComponent dataIn$={props.data} blockId$={props.id} />
        </div>
      }>
        <div id={__style.block} data-id={props.id}>
          <BlockComponent dataIn$={props.data} blockId$={props.id} />
        </div>
      </Show>
    )
  }

  // a weird hack to acturally show the correct data
  // because idk why the data is being desynced
  // what's a nightmare
  const [shouldUpdate, setShouldUpdate] = createSignal(false)
  createEffect(() => {
    if (isReadonly$()) {
      setShouldUpdate(true)
      setShouldUpdate(false)
    }
  }) 

  return (
    <div class={mergeClassname(
      __scrollbarStyle.scrollbar,
      __scrollbarStyle.scrollbarVertical,
      __scrollbarStyle.invsScrollbar,
      stylex.attrs(style.editor)
    )} ref={scrollableElement}>
      <div {...stylex.attrs(style.blockList)}>
        <Show when={!shouldUpdate()}>
          <For each={blocks$.data$()}>
            {it => <EditorBlock {...it} />}
          </For>
        </Show>
      </div>
      <Show when={!isReadonly$()}>
        <BlockButtonRow currentYPosition$={internal$.buttonRow$.currentPosition$().y} />
      </Show>
    </div>
  )
}