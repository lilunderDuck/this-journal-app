import { 
  type Accessor,
  createSignal,
  type Signal, 
} from "solid-js"
// ...
import { 
  type IJournalData, 
  type JournalContentData, 
  JournalType, 
  type JournalSchema,
  api_createJournal, 
  api_deleteJournal, 
  api_saveJournalContent,
  api_getJournal,
} from "~/api/journal"
import { useEditorContext } from "~/features/editor"
import { journalLog } from "~/features/debug"
// ...
import { JournalEvent } from "./event"

export interface IJournalUtils {
  /**Accessor for the currently opened journal data. 
   * Returns the currently opened journal data or undefined if none is open.
   */
  currentlyOpened$: Accessor<IJournalData | undefined>
  /**Creates a new journal.
   * @param data The initial data for the new journal.
   * @param type The type of the journal file.
   * @returns A promise that resolves to the created journal data.
   */
  create$(data: JournalSchema, type: JournalType): Promise<IJournalData>
  /**Deletes a journal.
   * @param journalId The ID of the journal to delete.
   * @returns A promise that resolves when the journal is deleted.
   */
  delete$(journalId: number): Promise<void>
  /**Opens a journal.
   * @param journalId The ID of the journal to open.
   * @returns A promise that resolves when the journal is opened.
   */
  open$(journalId: number): Promise<void>
  /**Saves changes to a journal.
   * @param journalId The ID of the journal to save.
   * @param data The new data for the journal.
   * @returns A promise that resolves to an empty object or null.
   */
  save$(journalId: number, data: JournalContentData): Promise<void>
  isLoading$: Signal<boolean>
}

export function createJournal(
  getCurrentJournalGroupId: () => number,
  event: JournalEvent
): IJournalUtils {
  const { open$ } = useEditorContext()

  const [currentlyOpened$, setCurrentlyOpened$] = createSignal<IJournalData>()

  const create: IJournalUtils["create$"] = async(data, type) => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    const newData = await api_createJournal(currentJournalGroupId, data, type)

    event.emit$("journal__createdJournal$", type, newData)

    // const newFileNode = type === JournalType.journal ? 
    //   createFileNodeData(newData.id) : 
    //   createFolderNodeData(newData!.id)
    // // ...
    // fileDisplayContext.mapping$[newData.id] = newData
    // fileDisplayContext.add$(newFileNode, 'root')

    isDevMode && journalLog.log('created new journal:', newData)

    return newData
  }

  const open: IJournalUtils["open$"] = async(journalId) => {
    isDevMode && journalLog.group("Opening", journalId)
    
    const currentJournalGroupId = getCurrentJournalGroupId()
    const journalData = await api_getJournal(currentJournalGroupId, journalId, JournalType.journal)
    const journalContent = journalData.data

    isDevMode && journalLog.log("journal data is:", journalData)
    
    setCurrentlyOpened$(journalData)
    
    isDevMode && journalLog.log("journal should open now")
    
    open$({
      id: journalId,
      content: journalContent
    })

    event.emit$("journal__openJournal$", journalData)

    isDevMode && journalLog.groupEnd()
  }

  const deleteJournal: IJournalUtils["delete$"] = async(journalId) => {
    const currentJournalGroupId = getCurrentJournalGroupId()
    await api_deleteJournal(currentJournalGroupId, journalId)
    setCurrentlyOpened$(undefined)
    isDevMode && journalLog.log("deleted:", journalId)
  }

  const save: IJournalUtils["save$"] = async(journalId, data) => {
    isDevMode && journalLog.log("saving", journalId)
    
    const currentJournalGroupId = getCurrentJournalGroupId()
    await api_saveJournalContent(currentJournalGroupId, journalId, data)
  }

  return {
    currentlyOpened$, 
    create$: create,
    delete$: deleteJournal,
    open$: open,
    save$: save,
    isLoading$: createSignal(true)
  }
}