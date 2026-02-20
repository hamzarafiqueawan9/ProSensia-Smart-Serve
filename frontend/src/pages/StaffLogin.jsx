import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { grantRoleAccess } from '../auth/staffAccess'
import styles from './StaffLogin.module.css'

const STAFF_CODES = {
  kitchen: import.meta.env.VITE_KITCHEN_PASSCODE || 'kitchen123',
  runner: import.meta.env.VITE_RUNNER_PASSCODE || 'runner123',
}

export default function StaffLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [role, setRole] = useState(location.state?.role === 'runner' ? 'runner' : 'kitchen')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const fromPath = useMemo(() => {
    const from = location.state?.from
    return typeof from === 'string' && from.startsWith('/') ? from : role === 'runner' ? '/runner' : '/kitchen'
  }, [location.state?.from, role])

  const onSubmit = (e) => {
    e.preventDefault()
    if (code.trim() !== STAFF_CODES[role]) {
      setError('Invalid passcode')
      return
    }

    grantRoleAccess(role)
    navigate(fromPath, { replace: true })
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Staff Access</h1>
        <p className={styles.subtitle}>Only kitchen and runner staff can open these panels.</p>

        <form onSubmit={onSubmit} className={styles.form}>
          <label className={styles.label}>
            Role
            <select className={styles.select} value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="kitchen">Kitchen</option>
              <option value="runner">Runner</option>
            </select>
          </label>

          <label className={styles.label}>
            Passcode
            <input
              className={styles.input}
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter staff passcode"
            />
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button type="submit" className={styles.button}>Unlock {role}</button>
        </form>

        <Link className={styles.backLink} to="/menu">Back to menu</Link>
      </div>
    </section>
  )
}
