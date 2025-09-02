import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  subSetting: {
    paddingLeft: 15,
    paddingBlock: 5,
    marginTop: 5,
    borderLeft: "2px solid var(--gray10)"
  },
})

interface ISubSettingProps {
  // define your component props here
}

export function SubSetting(props: HTMLAttributes<"div">) {
  return (
    <div 
      {...props}
      class={macro_mergeClassnames(
        props,
        stylex.attrs(style.subSetting)
      )}
    />
  )
}