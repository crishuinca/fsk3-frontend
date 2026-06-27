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

async function loginProfesor(page) {
  await page.goto('/login')
  await page.getByLabel('Usuario o correo').fill('profesor')
  await page.getByLabel('Contraseña').fill('clave123')
  await page.getByRole('button', { name: 'Iniciar sesion' }).click()
  await expect(page.getByText('Plataforma de libro de clases digital')).toBeVisible()
}

async function buscarEstudiante(page, boton) {
  await page.getByRole('button', { name: boton }).click()
  await expect(page.getByText('Cristobal')).toBeVisible()
  await expect(page.getByText('21827564-8')).toBeVisible()
}

test.beforeAll(async ({ request }) => {
  await crearEstudianteSiFalta(request)
})

test('profesor recorre la aplicacion', async ({ page }) => {
  const anotacion = `Anotacion E2E ${Date.now()}`
  const asistencia = `Asistencia E2E ${Date.now()}`

  await loginProfesor(page)

  await page.getByRole('link', { name: 'Perfil estudiante' }).click()
  await expect(page.getByRole('heading', { name: 'Perfil de estudiante' })).toBeVisible()
  await buscarEstudiante(page, 'Buscar perfil')

  await page.getByRole('link', { name: 'Anotaciones del estudiante' }).click()
  await expect(page.getByRole('heading', { name: 'Anotaciones del estudiante' })).toBeVisible()
  await buscarEstudiante(page, 'Buscar anotaciones')

  await page.getByRole('link', { name: 'Asistencia del estudiante' }).click()
  await expect(page.getByRole('heading', { name: 'Asistencia del estudiante' })).toBeVisible()
  await buscarEstudiante(page, 'Buscar asistencia')

  await page.getByRole('link', { name: 'Registrar anotacion' }).click()
  await page.getByLabel('Descripcion').fill(anotacion)
  await page.getByRole('button', { name: 'Guardar anotacion' }).click()
  await expect(page.getByText('Anotacion registrada correctamente.')).toBeVisible()

  await page.getByRole('link', { name: 'Registrar asistencia' }).click()
  await page.getByLabel('Observacion').fill(asistencia)
  await page.getByRole('button', { name: 'Guardar asistencia' }).click()
  await expect(page.getByText('Asistencia registrada correctamente.')).toBeVisible()

  await page.getByRole('link', { name: 'Anotaciones del estudiante' }).click()
  await page.getByRole('button', { name: 'Buscar anotaciones' }).click()
  await expect(page.getByText(anotacion)).toBeVisible()

  await page.getByRole('link', { name: 'Asistencia del estudiante' }).click()
  await page.getByRole('button', { name: 'Buscar asistencia' }).click()
  await expect(page.getByText(asistencia)).toBeVisible()

  await page.getByRole('button', { name: 'Cerrar sesion' }).click()
  await expect(page.getByRole('heading', { name: 'Inicio de sesion' })).toBeVisible()
})
