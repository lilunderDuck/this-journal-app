import { For, lazy } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { useTodoDataContext, useTodoSectionContext } from "../provider"
import Todo from "../variant/Todo"
import { ITodo } from "~/features/editor/types"

const style = stylex.create({
  todoList: {
    marginBottom: 10
  }
})

interface ITodoListProps {
  list: ITodo[]
}

export function TodoList(props: ITodoListProps) {
  const { id } = useTodoSectionContext()
  const { sectionTodoLookup$, updateTodo$, setSomeTodoToEditMode$ } = useTodoDataContext()

  const [todos] = sectionTodoLookup$[id]
  const CreateTodoInput = lazy(() => import('./CreateTodoInput'))
  let lastId = -1, firstTime = false

  const closeEditTodoInput = (someId: number) => setSomeTodoToEditMode$(id, someId, false)

  return (
    <div {...stylex.attrs(style.todoList)}>
      <For each={props.list}>
        {it => {
          if (!firstTime && lastId === it.id) {
            console.log('dupercated, refused to render', it.id)
            firstTime = true
            return null
          }

          lastId = it.id
          console.log('render', it)
          if (it.isEditing$) {
            return (
              <CreateTodoInput  
                onClose$={() => closeEditTodoInput(it.id)}
                onSubmit$={(data) => {
                  updateTodo$(id, it.id, data)
                  closeEditTodoInput(it.id)
                }}
                isEditMode$={true}
                {...it}
              />
            )
          }

          return (
            <Todo {...it} />
          )
        }}
      </For>
    </div>
  )
}