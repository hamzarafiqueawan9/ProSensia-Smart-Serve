import { useEffect, useMemo, useState } from 'react'
import { getOrdersApi, updateOrderStatusApi } from '../api'
import styles from './RoleBoard.module.css'

function byNewest(a, b) {
  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
}

export default function Kitchen() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  const loadOrders = async () => {
    try {
      const data = await getOrdersApi()
      setOrders(Array.isArray(data) ? data : [])
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    const safeLoad = async () => {
      if (!mounted) return
      await loadOrders()
    }

    safeLoad()
    const timer = setInterval(safeLoad, 4000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const kitchenOrders = useMemo(
    () => orders.filter((order) => order.status !== 'Delivered').sort(byNewest),
    [orders],
  )

  const changeStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId)
    try {
      await updateOrderStatusApi(orderId, status)
      await loadOrders()
    } catch (err) {
      setError(err.message || 'Status update failed')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.headRow}>
        <h1 className={styles.title}>Kitchen Board</h1>
        <button type="button" className={styles.refreshBtn} onClick={loadOrders}>
          Refresh
        </button>
      </div>
      <p className={styles.subtitle}>Prepare orders, then hand off to runner.</p>

      {error && <p className={styles.error}>{error}</p>}
      {loading ? <p className={styles.meta}>Loading orders…</p> : null}

      {kitchenOrders.length === 0 && !loading ? (
        <p className={styles.empty}>No active kitchen orders right now.</p>
      ) : (
        <div className={styles.list}>
          {kitchenOrders.map((order) => {
            const isPreparing = order.status === 'Preparing'
            return (
              <article key={order.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.orderId}>#{order.id}</span>
                  <span className={styles.statusPill}>{order.status}</span>
                </div>
                <p className={styles.item}>{order.item}</p>
                <p className={styles.meta}>Station: {order.station}</p>
                <p className={styles.meta}>Priority: {order.priority}</p>
                <p className={styles.meta}>
                  Created: {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.primaryBtn}
                    disabled={!isPreparing || updatingOrderId === order.id}
                    onClick={() => changeStatus(order.id, 'On Way')}
                  >
                    {updatingOrderId === order.id ? 'Updating…' : 'Mark On Way'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
