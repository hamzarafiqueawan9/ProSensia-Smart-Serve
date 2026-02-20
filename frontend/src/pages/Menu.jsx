import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useOrder } from '../context/OrderContext'
import styles from './Menu.module.css'

const MENU_ITEMS = [
  { 
    id: 'coffee', 
    name: 'Coffee', 
    price: 2.5,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop&q=80'
  },
  { 
    id: 'latte', 
    name: 'Latte', 
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&q=80'
  },
  { 
    id: 'cappuccino', 
    name: 'Cappuccino', 
    price: 3.5,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&q=80'
  },
  { 
    id: 'espresso', 
    name: 'Espresso', 
    price: 2,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=300&fit=crop&q=80'
  },
  { 
    id: 'tea', 
    name: 'Tea', 
    price: 2,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop&q=80'
  },
  { 
    id: 'croissant', 
    name: 'Croissant', 
    price: 2.5,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop&q=80'
  },
  { 
    id: 'sandwich', 
    name: 'Sandwich', 
    price: 5,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&q=80'
  },
]

export default function Menu() {
  const [searchParams] = useSearchParams()
  const stationFromQuery = useMemo(() => {
    // Prefer explicit station name if provided, e.g. ?station=Bay-12
    const stationParam = searchParams.get('station')
    if (stationParam && stationParam.trim()) return stationParam.trim()

    // Also support pure table number from QR, e.g. ?table=12 → "Table-12"
    const tableParam = searchParams.get('table')
    if (tableParam && tableParam.trim()) return `Table-${tableParam.trim()}`

    return ''
  }, [searchParams])
  const [stationInput, setStationInput] = useState(() => {
    if (stationFromQuery) return stationFromQuery
    const savedStation = localStorage.getItem('stc_station_name')
    return savedStation?.trim() || ''
  })
  const [cart, setCart] = useState([])
  const [urgent, setUrgent] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const { placeOrder } = useOrder()
  const navigate = useNavigate()

  useEffect(() => {
    if (stationFromQuery) {
      setStationInput(stationFromQuery)
    }
  }, [stationFromQuery])

  useEffect(() => {
    const trimmed = stationInput.trim()
    if (trimmed) {
      localStorage.setItem('stc_station_name', trimmed)
    }
  }, [stationInput])

  const station = stationInput.trim()

  const addItem = (item) => {
    setCart((c) => [...c, { ...item, key: `${item.id}-${Date.now()}` }])
  }

  const removeItem = (key) => {
    setCart((c) => c.filter((i) => i.key !== key))
  }

  const total = cart.reduce((s, i) => s + i.price, 0)

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return
    let stationToUse = station
    if (!stationToUse) {
      const typedStation = window.prompt('Enter your table/station name (e.g. Table-12):', '')
      stationToUse = typedStation?.trim() || ''
      if (!stationToUse) {
        setError('Please enter your table/station name before placing order.')
        return
      }
      setStationInput(stationToUse)
    }
    setError(null)
    setPlacing(true)
    try {
      const orderId = await placeOrder({
        station: stationToUse,
        items: cart.map(({ id, name, price }) => ({ id, name, price })),
        urgent,
      })
      navigate(`/order/${orderId}`)
    } catch (err) {
      setError(err.message || 'Failed to place order. Is the backend running?')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.stationBar}>
        <label htmlFor="station-input" className={styles.stationLabel}>Your station</label>
        <input
          id="station-input"
          className={styles.stationInput}
          value={stationInput}
          onChange={(e) => setStationInput(e.target.value)}
          placeholder="e.g. Table-12 / Bay-A"
          autoComplete="off"
        />
      </div>

      <h1 className={styles.title}>Menu</h1>
      <p className={styles.subtitle}>
        Tap to add — we’ll bring it to {station || 'your station'}
      </p>

      <ul className={styles.menuList}>
        {MENU_ITEMS.map((item) => (
          <li key={item.id} className={styles.menuItem}>
            <button type="button" onClick={() => addItem(item)} className={styles.menuBtn}>
              <div className={styles.itemImageWrapper}>
                <img 
                  src={item.image} 
                  alt={item.name}
                  className={styles.itemImage}
                  loading="lazy"
                />
              </div>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <section className={styles.cartSection}>
        <h2 className={styles.cartTitle}>Your order</h2>
        {cart.length === 0 ? (
          <p className={styles.cartEmpty}>No items yet. Tap something above.</p>
        ) : (
          <>
            <ul className={styles.cartList}>
              {cart.map((item) => (
                <li key={item.key} className={styles.cartItem}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className={styles.cartImage}
                  />
                  <span className={styles.cartItemName}>{item.name}</span>
                  <span className={styles.cartPrice}>${item.price.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className={styles.removeBtn}
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.cartStationRow}>
              <label htmlFor="station-input-inline" className={styles.cartStationLabel}>
                Delivery table / station
              </label>
              <input
                id="station-input-inline"
                className={styles.cartStationInput}
                value={stationInput}
                onChange={(e) => setStationInput(e.target.value)}
                placeholder="e.g. Table-12 / Bay-A"
                autoComplete="off"
              />
            </div>
            <label className={styles.urgentLabel}>
              <input
                type="checkbox"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
              />
              <span>Mark as urgent</span>
            </label>
            <div className={styles.cartFooter}>
              {error && (
                <p className={styles.orderError} role="alert">
                  {error}
                </p>
              )}
              <strong>Total: ${total.toFixed(2)}</strong>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className={styles.placeBtn}
                disabled={placing}
              >
                {placing ? 'Placing order…' : 'Place order'}
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
