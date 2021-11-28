// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import useStateWithPersistentLocalStorage from './02_custom_hook'

function LogValue({initialValueIfNoStorageValue = ''}) {
  const [value, setValue] = useStateWithPersistentLocalStorage(
    initialValueIfNoStorageValue,
    'name',
  )

  function onButtonClick() {
    console.log('button clicked')
  }

  const valueString =
    value !== undefined && value !== null
      ? JSON.stringify(value, undefined, 2)
      : 'value is null or undefined'
  return (
    <div>
      <strong>value: {valueString}</strong>
      <button onClick={onButtonClick}></button>
    </div>
  )
}

function App() {
  return <LogValue initialValueIfNoStorageValue={''} />
}

export default App
