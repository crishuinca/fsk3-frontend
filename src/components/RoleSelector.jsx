import { useRole } from '../hooks/useRole'

function RoleSelector() {
  const { rol, setRol, roles } = useRole()

  return (
    <label className="role-selector">
      <span>Rol de demo</span>
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        {roles.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default RoleSelector
