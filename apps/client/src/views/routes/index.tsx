import { Navigate, Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import type { Component } from 'solid-js'

import { preloadRecentProjects } from './preloaders/home'
import { preloadGroups } from './preloaders/groups'

const RootView = lazy(async () => await import('../index'))
const HomeView = lazy(async () => await import('../home'))
const GroupsView = lazy(async () => await import('../groups'))
const ProjectsView = lazy(async () => await import('../projects'))
const FilesView = lazy(async () => await import('../projects/files'))

const RootRoute: Component = () => {
  return (
    <Router>
      <Route component={RootView} path="">
        <Route component={HomeView} path="/" preload={preloadRecentProjects} />
        <Route path="/groups">
          <Route component={GroupsView} path="/:id" preload={preloadGroups} />
          <Route component={ProjectsView} path="/:gid/projects/:pid">
            <Route path="" />
            <Route component={FilesView} path="/files/*path" />
          </Route>
        </Route>

        <Route component={() => <Navigate href="/" />} path="*" />
      </Route>
    </Router>
  )
}

export default RootRoute
