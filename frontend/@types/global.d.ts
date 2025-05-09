import type { JSX } from "solid-js"

export {}

declare global {
  /**Short-hand for
   * ```
   * import { JSX } from "solid-js"
   * type DivProps = JSX.HTMLElementTags<Something>
   * // use somewhere...
   * ```
   * 
   * It also cutting down the need to use
   * ```
   * JSX.HTMLAttributes<T>
   * JSX.AnchorHTMLAttributes<T>
   * JSX.AudioHTMLAttributes<T>
   * JSX.ButtonHTMLAttributes<T>
   * // ... many more ...
   * ```
   * 
   * @template ElementName the html element name, example: `'div'`
   */
  type HTMLAttributes<ElementName extends keyof HTMLElementTagNameMap> = 
    JSX.HTMLElementTags[ElementName]
  // ...

  type EventHandler<
    ElementName extends keyof HTMLElementTagNameMap, 
    EventName extends keyof HTMLAttributes<ElementName>
  > =
    HTMLAttributes<ElementName>[EventName]
  // ...

  /**A type representing an reference to a DOM element 
   * @template ElementName the html element name, example: `'div'` 
   */
  type Ref<ElementName extends keyof HTMLElementTagNameMap> = HTMLElementTagNameMap[ElementName]
  
  /**A type representing any function, regardless of its parameters or return type. */
  type AnyFunction = (...anything: any[]) => any

  /**A type representing any object, where the keys are strings and the values can be of any type. */
  type AnyObject = Record<string, any>

  type AnyClass = abstract new (...args: any) => any
}