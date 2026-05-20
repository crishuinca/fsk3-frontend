import { beforeEach, describe, expect, it, vi } from 'vitest'
import { verificarEstudianteExiste } from './validarEstudiante'

vi.mock('../services/bffApi', () => ({
  getPerfilEstudiante: vi.fn(),
}))

import { getPerfilEstudiante } from '../services/bffApi'

describe('verificarEstudianteExiste', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rechaza id invalido', async () => {
    await expect(verificarEstudianteExiste(0)).resolves.toBe('Debe ingresar un ID de estudiante valido.')
  })

  it('rechaza si el perfil no trae estudiante', async () => {
    getPerfilEstudiante.mockResolvedValue({ estudiante: null })

    await expect(verificarEstudianteExiste(99)).resolves.toBe(
      'No existe un estudiante registrado con el ID 99.',
    )
  })

  it('acepta estudiante existente', async () => {
    getPerfilEstudiante.mockResolvedValue({ estudiante: { id: 1 } })

    await expect(verificarEstudianteExiste(1)).resolves.toBe('')
  })

  it('propaga mensaje de error del BFF', async () => {
    getPerfilEstudiante.mockRejectedValue(new Error('Estudiante no encontrado'))

    await expect(verificarEstudianteExiste(5)).resolves.toBe('Estudiante no encontrado')
  })
})
