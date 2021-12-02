// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {useEffect, useReducer} from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../../pokemon'

const IDLE = 'idle'
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

const SET_TO_IDLE = 'SET_TO_IDLE'
const SET_TO_PENDING = 'SET_TO_PENDING'
const SET_TO_RESOLVED = 'SET_TO_RESOLVED'
const SET_TO_REJECTED = 'SET_TO_REJECTED'

function reducer(state, action) {
  switch (action.type) {
    case SET_TO_IDLE:
      return {
        ...state,
        status: IDLE,
        pokemon: null,
        error: null,
      }
    case SET_TO_PENDING:
      return {
        ...state,
        status: PENDING,
        pokemon: null,
        error: null,
      }
    case SET_TO_RESOLVED:
      return {
        ...state,
        status: RESOLVED,
        pokemon: action.pokemon,
        error: null,
      }
    case SET_TO_REJECTED:
      return {
        ...state,
        status: REJECTED,
        pokemon: null,
        error: action.error,
      }
    default:
      throw new Error('Incorrect action type for PokemonInfo reducer.')
  }
}

function PokemonInfo({pokemonName}) {
  const [state, dispatch] = useReducer(reducer, {
    status: IDLE,
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  useEffect(() => {
    // Fetch for pokemon data object
    async function fetchAndUpdatePokemon() {
      if (!isNonEmptyString(pokemonName)) {
        dispatch({type: SET_TO_IDLE})
        return
      }

      try {
        dispatch({type: SET_TO_PENDING})
        const fetchedPokemon = await fetchPokemon(pokemonName)

        dispatch({type: SET_TO_RESOLVED, pokemon: fetchedPokemon})
      } catch (e) {
        console.error('Error while fetching pokemon. Error:', e)

        dispatch({type: SET_TO_REJECTED, error: e})
      }
    }
    fetchAndUpdatePokemon()
  }, [pokemonName])

  function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0
  }

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
    "In PokemonInfo component: We've reached a part of the code that should be impossible to reach. For some reason, none of the conditions that lead to our component returning JSX were satisfied.",
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
