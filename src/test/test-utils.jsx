import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { RoleProvider } from '../context/RoleContext'

export function renderWithProviders(ui, { rol = 'PROFESOR' } = {}) {
  localStorage.setItem('rolActual', rol)

  return render(
    <RoleProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </RoleProvider>,
  )
}
