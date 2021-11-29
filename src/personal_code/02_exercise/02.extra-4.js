// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import useStateWithPersistentLocalStorage from './02_custom_hook'

function LogValue({initialValueIfNoStorageValue}) {
  const [value, setValue] = useStateWithPersistentLocalStorage(
    initialValueIfNoStorageValue,
    'myValue',
  )

  function onButtonClick() {
    console.log('button clicked')
    // Immutably change object in some way
    setValue(value => {
      return {
        ...value,
        count: value.count + 1,
      }
    })
  }

  const valueString =
    value !== undefined && value !== null
      ? JSON.stringify(value, undefined, 2)
      : 'value is null or undefined'
  return (
    <div style={styles.container}>
      <strong>value: {valueString}</strong>
      <button onClick={onButtonClick}>Click Me</button>
    </div>
  )
}

function App() {
  const countObject = {
    count: 0,
  }
  return <LogValue initialValueIfNoStorageValue={countObject} />
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}

export default App
