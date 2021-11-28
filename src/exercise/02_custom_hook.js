import {useState, useEffect} from 'react'

/**
 * `useState` but we 'cache' the value in localStorage for future use.
 * @param {string|function} initialStateIfNoStorageValueOrGetterFunc The initial
 * state or a function that returns the initial state. However, if there's
 * already a value for the given `localStorageKey` in local storage, that value
 * will be used instead and this argument will be ignored. If this param is a
 * function, it'll only run if/when it needs to.
 * @param {string} localStorageKey The key name to use when storing our state in
 * local storage. This key is initialized when this hook is first called and is
 * never changed afterwards, even if this param is given different values.
 * @returns {[string, function]} `[value, setValue]` - Works the same as from a
 * normal `useState`. Whenever you change the value, the corresponding local
 * storage value will also be updated to that value.
 */
export default function useStateWithPersistentLocalStorage(
  initialStateIfNoStorageValueOrGetterFunc,
  localStorageKey,
) {
  const getFallbackInitialState = () =>
    typeof initialStateIfNoStorageValueOrGetterFunc === 'function'
      ? initialStateIfNoStorageValueOrGetterFunc()
      : initialStateIfNoStorageValueOrGetterFunc
  const getInitialState = () =>
    window.localStorage.getItem(localStorageKey) ?? getFallbackInitialState()

  const [value, setValue] = useState(getInitialState)
  // Doing this because key should never change, even if a different key is
  // passed in the arguments
  const [key] = useState(localStorageKey)

  useEffect(() => {
    window.localStorage.setItem(key, value)
  }, [key, value])

  return [value, setValue]
}
