import { Navigate, Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import type { Component } from 'solid-js'
import { ColorModeProvider, ColorModeScript } from '@kobalte/core'

import { preloadRecentProjects } from './preloaders/home'
import { preloadGroups } from './preloaders/groups'

const RootView = lazy(async () => await import('@/views'))
const HomeView = lazy(async () => await import('@/views/home'))
const GroupsView = lazy(async () => await import('@/views/groups'))
const ProjectsView = lazy(async () => await import('@/views/projects'))
const FilesView = lazy(async () => await import('@/views/projects/files'))
const UsersView = lazy(async () => await import('@/views/users'))
const SignView = lazy(async () => await import('@/views/sign'))

const RootRoute: Component = () => {
  return (
    <>
      <ColorModeScript />
      <ColorModeProvider>
        <Router>
          <Route component={SignView} path="/sign" />
          <Route component={RootView} path="">
            <Route component={HomeView} path="/" preload={preloadRecentProjects} />
            <Route path="/users">
              <Route component={UsersView} path="/:id" />
            </Route>
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
      </ColorModeProvider>
    </>
  )
}

export default RootRoute
