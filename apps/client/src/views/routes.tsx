import { Navigate, Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import type { Component } from 'solid-js'

const RootView = lazy(async () => await import('./index'))

const RootRoute: Component = () => {
  return (
    <Router>
      <Route component={RootView} path="">
        <Route component={() => { return 'Recent Projects' }} path="/home" />
        <Route component={() => <Navigate href="/home" />} path="*" />
      </Route>
    </Router>
  )
}

export default RootRoute
