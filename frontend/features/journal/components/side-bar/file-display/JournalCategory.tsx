import { onCleanup, ParentProps, Show } from "solid-js"
import { BsCaretRightFill } from "solid-icons/bs"
// ...
import __style from "./Journal.module.css"
import stylex from "@stylexjs/stylex"
// ...
import type { IJournalCategoryData } from "~/api/journal"
import { FlexCenterY } from "~/components"
import { useToggleState } from "~/hook"
import { useJournalContext } from "~/features/journal/context"
import { createEffect } from "solid-js"
import { arrayObjects } from "~/utils"

const style = stylex.create({
  journalCategory: {
    transition: '0.15s ease-out',
    userSelect: 'none',
    paddingRight: 10,
  },
  nameAndStuff: {
    width: '100%',
    paddingBlock: 5,
    borderRadius: 6,
    ':hover': {
      backgroundColor: 'var(--gray3)'
    }
  },
  button: {
    flexShrink: 0,
    padding: 0,
    color: 'var(--gray11)',
    cursor: 'pointer',
    ':hover': {
      color: 'var(--gray12)'
    }
  },
  leftPadding: {
    // somehow, you want a 4.2 pixels margin here, please don't @me
    marginLeft: 4.2,
    paddingLeft: 5,
    borderLeft: "2px solid var(--gray5)"
  },
  arrow: {
    rotate: "90deg"
  }
})

interface IJournalCategoryProps extends IJournalCategoryData {
  onClick: EventHandler<"div", "onClick">
}

let currentlyOpened: number[] = []
export function JournalCategory(props: ParentProps<IJournalCategoryProps>) {
  const { localStorage$ } = useJournalContext()

  const [isShowing, toggleShowing] = useToggleState(currentlyOpened.includes(props.id))

  createEffect(() => {
    localStorage$.update$("explorer", (prev) => {
      prev = prev ? prev : []
      if (isShowing()) {
        prev.push(props.id)
      } else {
        arrayObjects(prev).removeByIndex$(prev.indexOf(props.id))
      }

      return prev
    })
  })

  onCleanup(() => {
    currentlyOpened = []
  })

  const clickThisThing: EventHandler<"div", "onClick"> = (mouseEvent) => {
    toggleShowing()
    if (isShowing()) {
      currentlyOpened.push(props.id)
    } else {
      let index = currentlyOpened.findIndex(it => it === props.id)
      currentlyOpened.splice(index, 1)
    }
    console.log(currentlyOpened)
    // @ts-ignore
    props.onClick?.(mouseEvent)
  }

  return (
    <section id={__style.journal} {...stylex.attrs(style.journalCategory)}>
      <FlexCenterY {...stylex.attrs(style.nameAndStuff)} onClick={clickThisThing}>
        <BsCaretRightFill
          {...stylex.attrs(isShowing() ? style.arrow : {})}
          size={10}
        />
        <span id={__style.name}>
          {props.name}
        </span>
      </FlexCenterY>
      <Show when={isShowing()}>
        <div {...stylex.attrs(style.leftPadding)}>
          {props.children}
        </div>
      </Show>
    </section>
  )
}
