import { useCallback, useEffect, useRef, useState } from 'react'

// ============================================================================
//  GestiPerso — Data-fetching hook
//  ---------------------------------------------------------------------------
//  Every screen used to re-implement `useState(loading) + useEffect(fetch)`.
//  This hook centralises the three states a screen must always show:
//  loading, error and data (plus a `reload()` for lists and forms).
//
//  Usage:
//    const { data, loading, error, reload } = useAsyncData(() => getDossiers(), [])
//    const dossiers = data?.data ?? []          // axios response passthrough
// ============================================================================

/**
 * @param {() => Promise<any>} loader async function returning the data
 * @param {Array} deps dependency list, same semantic as useEffect
 * @param {{ initialData?: any, keepPreviousData?: boolean }} options
 */
export const useAsyncData = (loader, deps = [], options = {}) => {
  const { initialData = null, keepPreviousData = false } = options

  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await loaderRef.current()
      if (isMounted.current) {
        setData((previous) => (result === undefined || result === null ? previous : result))
        setLoading(false)
      }
      return result
    } catch (caught) {
      if (isMounted.current) {
        if (!keepPreviousData) setData(initialData)
        setError(caught)
        setLoading(false)
      }
      return null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keepPreviousData, initialData])

  useEffect(() => {
    reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, reload, setData }
}

export default useAsyncData
