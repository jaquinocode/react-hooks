// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {useState, useEffect} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'
// import AppWithReducer from '../personal_code/06_exercise/06_with_reducer'

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    status: IDLE,
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  useEffect(() => {
    // Fetch for pokemon data object
    async function fetchAndUpdatePokemon() {
      if (!isNonEmptyString(pokemonName)) {
        setState(state => ({
          ...state,
          status: IDLE,
        }))
        return
      }

      try {
        setState(state => ({
          ...state,
          status: PENDING,
        }))
        const fetchedPokemon = await fetchPokemon(pokemonName)

        setState(state => ({
          ...state,
          status: RESOLVED,
          pokemon: fetchedPokemon,
        }))
      } catch (e) {
        console.error('Error while fetching pokemon. Error:', e)

        setState(state => ({
          ...state,
          status: REJECTED,
          error: e,
        }))
      }
    }
    fetchAndUpdatePokemon()
  }, [pokemonName])

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0
  }

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />
  if (status === IDLE) {
    return <p>Submit a pokemon</p>
  } else if (status === REJECTED) {
    return (
      <div role="alert">
        There was an error:{' '}
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (status === PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error(
    "In PokemonInfo component: We've reached a part of the code that should be impossible to reach. For some reason, none of the conditions that lead to returning JSX were satisfied.",
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
// export default AppWithReducer
