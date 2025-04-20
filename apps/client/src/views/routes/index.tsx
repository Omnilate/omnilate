import { Navigate, Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import type { Component } from 'solid-js'

import { preloadRecentProjects } from './preloaders/home'
import { preloadGroups } from './preloaders/groups'

const RootView = lazy(async () => await import('../index'))
const HomeView = lazy(async () => await import('../home'))
const GroupsView = lazy(async () => await import('../groups'))
const ProjectsView = lazy(async () => await import('../projects'))

const RootRoute: Component = () => {
  return (
    <Router>
      <Route component={RootView} path="">
        <Route component={HomeView} path="/home" preload={preloadRecentProjects} />
        <Route component={GroupsView} path="/groups/:id" preload={preloadGroups} />
        <Route component={ProjectsView} path="/groups/:gid/projects/:pid" />
        <Route component={() => <Navigate href="/home" />} path="*" />
      </Route>
    </Router>
  )
}

export default RootRoute
