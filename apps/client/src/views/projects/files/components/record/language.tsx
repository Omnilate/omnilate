import type { Component } from 'solid-js'

interface LanguageProps {
  foo: string
}

const Language: Component<LanguageProps> = (props) => {
  return (
    <div class="flex">
      Language
    </div>
  )
}

export default Language
