/* @refresh reload */
import { render } from 'solid-js/web'

import 'virtual:uno.css'
import '@/assets/styles/global.css'
import RootRoute from './views/routes'

render(() => <RootRoute />, document.getElementById('root')!)
