import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"
import { lazy, splitProps } from "solid-js"
import { IconTypes } from "solid-icons"
// ...
import { 
  Button, 
  ButtonSizeVariant, 
  createLazyLoadedDialog, 
  FlexCenterY, 
  Spacer, 
  Tooltip 
} from "~/components"
import { useThisEditorContext } from "~/features/editor"
import { EditOrReadonlyIcon } from "~/features/journal"
// ...
import { useJournalContext } from "../context"

const style = stylex.create({
  buttonsRow: {
    gap: 10
  },
  button: {
    flexShrink: 0,
    // forced to be this way
    backgroundColor: 'var(--gray1) !important',
    color: 'var(--gray11)',
    ':hover': {
      backgroundColor: 'var(--gray4) !important',
      color: 'var(--gray12)'
    }
  }
})

interface IButtonItemProps extends HTMLAttributes<"button"> {
  $icon: IconTypes
  $label: string
}

export function SidebarButtonsRow() {
  const { $journal } = useJournalContext()
  const { $setIsEditable } = useThisEditorContext()
  const toggleEditOrReadonlyMode = () => {
    $setIsEditable(prev => !prev)
  }

  const ButtonItem = (props: IButtonItemProps) => {
    const [, buttonProps] = splitProps(props, ["$icon", "$label"])
    return (
      <Tooltip $label={props.$label}>
        <Button 
          {...buttonProps}
          $size={ButtonSizeVariant.icon} 
          {...stylex.attrs(style.button)}
        >
          <props.$icon />
        </Button>
      </Tooltip>
    )
  }

  const createStuffModal = createLazyLoadedDialog(
    lazy(() => import('./CreateStuffModal'))
  )

  return (
    <FlexCenterY {...stylex.attrs(style.buttonsRow)}>
      <ButtonItem 
        editor-tour-create-journal-button
        onClick={createStuffModal.$show}
        $icon={BsPlus}
        $label={'New journal'}
      />
      <Spacer />
      <ButtonItem 
        rough-toggle-edit-or-readonly-button
        editor-tour-toggle-edit-or-readonly-button
        onClick={toggleEditOrReadonlyMode}
        disabled={!$journal.$currentlyOpened()}
        $icon={EditOrReadonlyIcon}
        $label={`Toggle ${true ? 'read-only' : 'edit'} mode`}
      />
      {/* ... */}
      <createStuffModal.$Modal />
    </FlexCenterY>
  )
}