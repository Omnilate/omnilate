import type { Component } from 'solid-js'

import CreateNewProject from './create-new-project'
import Controls from './controls'
import Me from './me'

const Bottom: Component = () => {
  return (
    <>
      <CreateNewProject />
      <Controls />
      <Me />
    </>
  )
}

export default Bottom
