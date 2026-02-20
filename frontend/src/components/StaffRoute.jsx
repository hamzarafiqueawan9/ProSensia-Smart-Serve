import { Navigate, useLocation } from 'react-router-dom'
import { hasRoleAccess } from '../auth/staffAccess'

export default function StaffRoute({ role, children }) {
  const location = useLocation()
  if (!hasRoleAccess(role)) {
    return <Navigate to="/staff-login" replace state={{ from: location.pathname, role }} />
  }
  return children
}
