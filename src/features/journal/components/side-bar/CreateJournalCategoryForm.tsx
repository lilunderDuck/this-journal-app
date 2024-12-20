import { 
  createForm, 
  required, 
  type SubmitHandler 
} from "@modular-forms/solid"
import { createSignal } from "solid-js"
// ...
import { 
  type JournalApi,
} from "~/api/journal"
import { 
  FieldInput,
  OpenAndCloseButton
} from "~/components"
import { toast } from "~/features/toast"
// ...
import { useJournalContext } from "~/features/journal/context"

interface ICreateJournalCategoryFormProps {
  onClick: () => any
}

export default function CreateJournalCategoryForm(props: ICreateJournalCategoryFormProps) {
  const { $journal } = useJournalContext()
  const [, setTree] = $journal.$fileTree

  const [_journalGroupForm, { Field, Form }] = createForm<JournalApi.Journal>()
  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const submit: SubmitHandler<JournalApi.Journal> = async(data) => {
    setSubmitButtonDisabled(true)
    const dataReturned = await toast
      .promise($journal.$create(data), {
        loading: 'Saving changes...',
        success: 'Done!',
        error: 'Failed to save changes :('
      })  
      .catch(() => setSubmitButtonDisabled(false))
    // ...

    if (!dataReturned) return
    
    setTree(prev => [...prev, dataReturned])
    setSubmitButtonDisabled(false)
    props.onClick()
  }

  return (
    <Form onSubmit={submit} autocomplete="off">
      <Field name="name" validate={[
        required('Come on, put something into here you know?')
      ]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            label='Name'
            placeholder="What is your journal about?"
            type="text"
            required
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <OpenAndCloseButton 
        $closeText='Dismiss'
        $openText="Submit"
        $onClickingClose={props.onClick}
        $openButtonProps={{
          type: 'submit',
          disabled: submitButtonDisabled()
        }}
      />
    </Form>
  )
}