/* @refresh reload */
import { render } from 'solid-js/web'
import 'virtual:uno.css'
import '@/assets/styles/global.css'

import RootView from './views'

render(() => <RootView />, document.getElementById('root')!)
