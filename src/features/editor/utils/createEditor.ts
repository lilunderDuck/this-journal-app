import EditorJS from '@editorjs/editorjs'
// ...
import { createColorPicker, someToolsIShouldNeed } from '../tools'
import { mergeObjects } from '~/common'

export const createEditor = (
  whereToPut: HTMLElement,
  isEditable: boolean,
  onUpdate: AnyFunction
) => {
  return new EditorJS({
    holder: whereToPut,
    autofocus: true,
    readOnly: isEditable,
    // @ts-ignore
    tools: mergeObjects(
      someToolsIShouldNeed(),
      {
        colorPicker: createColorPicker()
      }
    ),
    onReady() {
      console.log('[editor] editor created')
    },
    onChange() {
      onUpdate()
    }
  })
}