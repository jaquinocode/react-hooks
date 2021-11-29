// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import useStateWithPersistentLocalStorage from '../personal_code/02_exercise/02_custom_hook'

function PersistentGreeting({initialNameIfNoStorageValue = ''}) {
  const [name, setName] = useStateWithPersistentLocalStorage(
    initialNameIfNoStorageValue,
    'name',
  )

  function onInputChange(event) {
    const inputTextValue = event.target.value
    setName(inputTextValue)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={onInputChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <PersistentGreeting initialNameIfNoStorageValue="" />
}

export default App
