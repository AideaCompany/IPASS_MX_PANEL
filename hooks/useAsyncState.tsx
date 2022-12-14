import { useState, useRef, useCallback, useEffect } from 'react'

function useAsyncState(initialState: any) {
  const [state, setState] = useState(initialState)
  const resolveState = useRef()
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (resolveState.current) {
      //@ts-ignore
      resolveState.current(state)
    }
  }, [state])

  const setAsyncState = useCallback(
    newState =>
      new Promise(resolve => {
        if (isMounted.current) {
          //@ts-ignore
          resolveState.current = resolve
          setState(newState)
        }
      }),
    []
  )

  return [state, setAsyncState]
}

export default useAsyncState
