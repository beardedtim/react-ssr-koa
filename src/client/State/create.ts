import { createStore, applyMiddleware, compose } from 'redux'

const composeEnhancers = typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
  : compose;


const reducer = (state: any, action: any) => state

export default (preloadedState = {}) => createStore(reducer, preloadedState, composeEnhancers(
  applyMiddleware()
))