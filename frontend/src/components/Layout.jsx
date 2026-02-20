import { Outlet, Link } from 'react-router-dom'
import styles from './Layout.module.css'
import { clearRoleAccess, hasRoleAccess } from '../auth/staffAccess'

export default function Layout() {
  const hasKitchenAccess = hasRoleAccess('kitchen')
  const hasRunnerAccess = hasRoleAccess('runner')
  const hasAnyStaffAccess = hasKitchenAccess || hasRunnerAccess

  const lockPanels = () => {
    clearRoleAccess()
    window.location.assign('/menu')
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/menu" className={styles.logo}>STC</Link>
          <nav className={styles.roleNav}>
            {hasKitchenAccess ? <Link to="/kitchen" className={styles.roleLink}>Kitchen</Link> : null}
            {hasRunnerAccess ? <Link to="/runner" className={styles.roleLink}>Runner</Link> : null}
            {!hasAnyStaffAccess ? <Link to="/staff-login" className={styles.roleLink}>Staff</Link> : null}
            {hasAnyStaffAccess ? (
              <button type="button" className={styles.roleLink} onClick={lockPanels}>
                Lock
              </button>
            ) : null}
          </nav>
        </div>
        <span className={styles.tagline}>Order & track</span>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
