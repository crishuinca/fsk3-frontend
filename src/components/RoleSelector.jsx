import { useRole } from '../hooks/useRole'

function RoleSelector() {
  const { currentRole, rol, roles, setRol } = useRole()

  return (
    <div className="role-box">
      <label className="role-selector">
        <span>Rol actual</span>
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          {roles.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <small>{currentRole.description}</small>
    </div>
  )
}

export default RoleSelector
