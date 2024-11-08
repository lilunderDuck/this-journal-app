import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
// ...
import { ColorAndStuff } from '~/components'
import { Toaster } from '~/libs/toast'
import { StartupSequence } from '~/features/misc'

const HomePage = lazy(() => import('~/routes/index'))
const JournalPage = lazy(() => import('~/routes/journal'))
const ThisPageIsNotFound = lazy(() => import('~/routes/[...404]'))
const TooTechnicalPage = lazy(() => import('~/routes/too-technical'))

export default function App() {
  return (
    <ColorAndStuff>
      <StartupSequence />
      <Toaster />

      <Router>
        <Route path='/' component={HomePage} />
        <Route path='/journal/:id' component={JournalPage} />
        <Route path='/too-technical' component={TooTechnicalPage} />
        <Route path="*404" component={ThisPageIsNotFound} />
      </Router>
    </ColorAndStuff>
  )
}