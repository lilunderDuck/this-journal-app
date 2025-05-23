import { type Accessor, createContext, createSignal, type ParentProps, type Signal, useContext } from "solid-js"
// ...
import { editorLog } from "~/features/debug"
import { arrayInsert, getRandomNumberFrom } from "~/utils"
// ...
import { DEFAULT_NEWLINE_DATA, DEFAULT_TEXT_DATA, InputTextData, TextData, TextType } from "./data"
import { setCursorToTheEnd } from "~/features/editor/utils"

export interface ITextProviderProps {
  allowNewLine$?: boolean
  inputData$?: InputTextData
  onChange$(value: TextData[]): void
  onAddingNewLine$?: () => any
  onEmpty?: () => any
}

export interface ITextContext {
  textsData$: Accessor<TextData[]>
  updateData$(index: number, data: Partial<TextData>): void
  spawnNewTextInput$(index: number): void
  addNewLine$(currentIndex: number): void
  deleteInput$(index: number): void
  focusState$: Signal<number>
  readonly THIS_TEXT_BLOCK_ID$: `t-${number}`
  getInputElement$(index: number): HTMLDivElement
}

const Context = createContext<ITextContext>()

export function TextDataProvider(props: ParentProps<ITextProviderProps>) {
  const thisTextBlockId = `t-${getRandomNumberFrom(1, 999_999_999)}` as const

  const [textsData, setTextsData] = createSignal<TextData[]>(props.inputData$?.text ?? [
    DEFAULT_TEXT_DATA
  ])

  const isAllowNewLine = props.allowNewLine$ ?? true

  const updateData = (index: number, data: Partial<TextData>) => {
    setTextsData(prev => {
      const prevDataOfDatIndex = prev[index]
      const newData = {...prevDataOfDatIndex, ...data}
      for (const [key, value] of Object.entries(newData)) {
        const valueThatShouldNotBeSaved = value === 0 || value === '' || !value
        if (valueThatShouldNotBeSaved) {
          // @ts-ignore - should work with absolutely no weird thing happening under the hood
          delete newData[key]
        }
      }

      // @ts-ignore
      prev[index] = newData
      props.onChange$(textsData())
      isDevMode && editorLog.logLabel(
        'text', 
        'update text data at index', index, 'with', data, '. Data is', prev[index]
      )
      
      return prev
    })
  }

  const spawnNewTextInput = (index: number) => {
    setTextsData(prev => {
      arrayInsert(prev, index, DEFAULT_TEXT_DATA)
      return [...prev]
    })
    props.onChange$(textsData())
    setCursorToTheEnd(document.querySelector(`#${thisTextBlockId} [data-index="${index}"]`)!)
    isDevMode && editorLog.logLabel('text', 'Spawned new block')
  }

  const deleteInput = (index: number) => {
    setTextsData(prev => {
      const previousBlock = textsData()[index - 1]
      if (
        previousBlock !== undefined &&
        previousBlock.type === TextType.newLine
      ) {
        prev.splice(index - 1, 2)
        return [...prev]
      }

      prev.splice(index, 1)
      return [...prev]
    })

    props.onChange$(textsData())
    isDevMode && editorLog.logLabel('text', 'Deleted block at index', index)
  }

  const addNewLine = (currentIndex: number) => {
    if (!isAllowNewLine) return
    setTextsData(prev => {
      arrayInsert(prev, currentIndex + 1, DEFAULT_NEWLINE_DATA, DEFAULT_TEXT_DATA)

      return [...prev]
    })
  }

  return (
    <Context.Provider value={{
      focusState$: createSignal(0),
      addNewLine$: addNewLine,
      textsData$: textsData,
      updateData$: updateData,
      spawnNewTextInput$: spawnNewTextInput,
      deleteInput$: deleteInput,
      THIS_TEXT_BLOCK_ID$: thisTextBlockId,
      getInputElement$(index: number) {
        let e = document.querySelector<HTMLDivElement>(`#${thisTextBlockId} [data-index="${index}"] [contenteditable]`)!
        console.log(e)
        return e
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTextDataContext() {
  return useContext(Context)!
}