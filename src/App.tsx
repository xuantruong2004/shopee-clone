import { useContext, useEffect, useState } from 'react'
// import './App.css'
import useRouteElement from './useRouteElement'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'

function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return localStorageEventTarget.removeEventListener('clearLS', reset)
  }, [reset])
  return (
    <div>
      {routeElement}
      <ToastContainer autoClose={1000} position='top-center' />
    </div>
  )
}

export default App
