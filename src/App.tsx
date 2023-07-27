import { useContext, useEffect } from 'react'
// import './App.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppContext } from './contexts/app.context'
import useRouteElement from './useRouteElement'
import { localStorageEventTarget } from './utils/auth'

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
