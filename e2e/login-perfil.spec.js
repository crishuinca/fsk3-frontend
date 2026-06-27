import { test, expect } from '@playwright/test'

const MS_ACADEMICO = 'http://localhost:8081/api/v1'

async function crearEstudianteSiFalta(request) {
  const resp = await request.get(`${MS_ACADEMICO}/estudianteByID/1`)
  if (resp.ok()) {
    return
  }

  await request.post(`${MS_ACADEMICO}/addEstudiante`, {
    data: {
      cursoId: 1,
      rut: '21827564-8',
      nombres: 'Cristobal',
      apellidoPaterno: 'Huinca',
      apellidoMaterno: 'Aravena',
      email: 'cristobal@colegio.cl',
    },
  })
}

test.beforeAll(async ({ request }) => {
  await crearEstudianteSiFalta(request)
})

test('profesor inicia sesion y ve perfil', async ({ page }) => {
  await page.goto('/login')

  await page.getByLabel('Usuario o correo').fill('profesor')
  await page.getByLabel('Contraseña').fill('clave123')
  await page.getByRole('button', { name: 'Iniciar sesion' }).click()

  await expect(page.getByText('Plataforma de libro de clases digital')).toBeVisible()

  await page.getByRole('link', { name: 'Ver perfil' }).click()
  await page.getByRole('button', { name: 'Buscar perfil' }).click()

  await expect(page.getByText('Cristobal')).toBeVisible()
  await expect(page.getByText('21827564-8')).toBeVisible()
})
