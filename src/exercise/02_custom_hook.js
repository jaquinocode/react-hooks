import {useState, useEffect} from 'react'

/**
 * `useState` but we 'cache' the value in localStorage for future use.
 * @param {any|function} initialStateIfNoStorageValueOrGetterFunc The initial
 * state or a function that returns the initial state. However, if there's
 * already a value for the given `localStorageKey` in local storage, that value
 * will be used instead and this argument will be ignored. This param needs to
 * give a value that's serializable, since it'll be stored using localStorage.
 * If this param is a function, it'll only run if/when it needs to.
 * @param {string} localStorageKey The key name to use when storing our state in
 * local storage.
 * @returns {[any, function]} `[value, setValue]` - Works the same as from a
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
  const getInitialState = () => {
    const value = window.localStorage.getItem(localStorageKey)
    if (typeof value === 'string') {
      try {
        return JSON.parse(value)
        // Error in the case of trying to parse a string that's not a valid json
        // string. Might happen if we're dealing w/ a storage value that already
        // existed beforehand, that was not properly serialized before being
        // stored.
      } catch (error) {
        window.localStorage.removeItem(localStorageKey)
      }
    }

    return getFallbackInitialState()
  }

  const [value, setValue] = useState(getInitialState)

  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(value))

    // This cleanup is needed so that we don't get leftover items when the
    // key param changes
    return () => {
      window.localStorage.removeItem(localStorageKey)
    }
  }, [localStorageKey, value])

  return [value, setValue]
}
