import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import styled from '@emotion/styled'

import loadable from '@loadable/component'

const Home = loadable(() => import('./Home'))
const Hello = loadable(() => import('./Hello'))
const Typography = loadable(() => import('@material-ui/core/Typography'))
const CSSBaseline = loadable(() => import('@material-ui/core/CssBaseline'))

const StyledLink = styled(Link)`
  text-decoration: none;
`

const Page = styled.div``

/**
 * Everything from here down needs to be isomorphic/universal/
 * be able to be ran on both the Server and the Browser 
 */
const App = () => (
  <Page>
    <CSSBaseline />
    <StyledLink to="/">
      <Typography color="textPrimary">
        Home page
      </Typography>
    </StyledLink>
    <StyledLink to="/hello">
      <Typography color="textPrimary">
        Hello page
       </Typography>
    </StyledLink>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/hello" component={Hello} />
    </Switch>
  </Page>
)

export default App
