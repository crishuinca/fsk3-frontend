import { useRole } from '../hooks/useRole'

function RoleGuard({ permission, children, fallback = null }) {
  const { hasPermission } = useRole()

  if (!hasPermission(permission)) {
    return fallback
  }

  return children
}

export default RoleGuard
