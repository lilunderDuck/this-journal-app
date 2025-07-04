import { SolidRenderer } from "./SolidRenderer"
import { Editor, EditorOptions } from "@tiptap/core"
import { Accessor, createSignal, Setter } from "solid-js"

export class SolidEditor extends Editor {
  public declare renderers: Accessor<SolidRenderer[]>

  public declare setRenderers: Setter<SolidRenderer[]>

  public constructor(options?: Partial<EditorOptions>) {
    const [renderers, setRenderers] = createSignal<SolidRenderer[]>([])

    super(options)
    this.renderers = renderers
    this.setRenderers = setRenderers
  }
}