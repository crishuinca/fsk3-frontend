# frontend-libroclases

Frontend React de la Plataforma de Libro de Clases Digital del Colegio Bernardo O'Higgins.

Esta aplicación permite consultar perfiles de estudiantes, revisar anotaciones y asistencias, y registrar nuevas anotaciones o asistencias según el rol seleccionado.

El frontend consume solo al BFF `bff-libroclases`, que corre en el puerto `8083`.

## Tecnologías

- React 19
- Vite
- React Router DOM
- Context API
- Vitest
- Testing Library
- ESLint

## Requisitos

Antes de usar el frontend, levantar los servicios backend:

- `ms-academico`: `http://localhost:8081`
- `ms-asistencia`: `http://localhost:8082`
- `bff-libroclases`: `http://localhost:8083`

El frontend se conecta al BFF mediante:

```text
http://localhost:8083/api/v1
```

Si se necesita cambiar la URL del BFF, usar la variable:

```env
VITE_API_URL=http://localhost:8083/api/v1
```

## Instalación

Desde la carpeta del proyecto:

```powershell
cd "C:\Users\tobal\Desktop\Fullstack 3\frontend-libroclases"
npm install
```

## Cómo ejecutar

Modo desarrollo:

```powershell
npm run dev
```

URL por defecto:

```text
http://localhost:5173
```

Compilar para producción:

```powershell
npm run build
```

Vista previa del build:

```powershell
npm run preview
```

## Empaquetado NPM

El proyecto también está preparado para generar un paquete NPM reutilizable como librería React.

Build de librería:

```powershell
npm run build:lib
```

Generar paquete local:

```powershell
npm pack
```

El comando genera un archivo como:

```text
frontend-libroclases-1.0.0.tgz
```

Verificar publicación sin subir a npm:

```powershell
npm publish --dry-run
```

Exports principales del paquete:

- `LibroClasesApp`
- Componentes: `Navbar`, `RoleGuard`, `RoleSelector`, `InfoCard`, `Badge`, `Field`
- Contexto y hook: `RoleProvider`, `useRole`, `roles`, `permissionsByRole`
- Páginas: `Home`, `PerfilEstudiante`, `AnotacionDetalle`, `AsistenciaDetalle`, `RegistrarAnotacion`, `RegistrarAsistencia`
- Cliente BFF: `getPerfilEstudiante`, `getPerfilEstudiantePorRut`, `createAnotacion`, `createAsistencia`

Ejemplo de uso en otro proyecto React:

```jsx
import { LibroClasesApp } from 'frontend-libroclases'
import 'frontend-libroclases/style.css'

function App() {
  return <LibroClasesApp />
}
```

## Tests y cobertura

Ejecutar tests:

```powershell
npm run test
```

Ejecutar tests con coverage:

```powershell
npm run test:coverage
```

El reporte HTML queda en:

```text
coverage/index.html
```

Estado actual:

- 18 tests.
- Cobertura global aproximada: 77% por líneas.
- Umbral mínimo configurado: 80% en líneas, statements y functions; 74% en branches.

## CI/CD y SonarQube

El repositorio incluye un pipeline de GitHub Actions en:

```text
.github/workflows/ci-sonar.yml
```

El pipeline ejecuta:

- `npm ci`
- `npm run lint`
- `npm run test:coverage`
- `npm run build`
- `npm run build:lib`
- `npm pack --dry-run`
- Reporte de coverage como artefacto.
- Análisis SonarQube/SonarCloud si existen las variables y secretos necesarios.

Para activar Sonar en GitHub se debe configurar:

- Secret: `SONAR_TOKEN`
- Variable: `SONAR_ORGANIZATION`
- Variable opcional: `SONAR_PROJECT_KEY`
- Variable opcional: `SONAR_HOST_URL` si se usa SonarQube propio en vez de SonarCloud.

## Lint

Ejecutar revisión de ESLint:

```powershell
npm run lint
```

## Funcionalidades principales

- Selector de rol simulado.
- Navegación protegida por permisos.
- Consulta de perfil de estudiante por ID o RUT.
- Consulta de anotaciones del estudiante por ID o RUT.
- Consulta de asistencia del estudiante por ID o RUT.
- Registro de anotaciones.
- Registro de asistencias.
- Validaciones simples en formularios.
- Mensajes de error y éxito.
- Consumo centralizado del BFF desde `src/services/bffApi.js`.

## Roles

Profesor:

- Consulta perfil.
- Consulta anotaciones.
- Consulta asistencia.
- Registra anotaciones.
- Registra asistencia.

Inspector:

- Consulta perfil.
- Consulta anotaciones.
- Consulta asistencia.
- Registra asistencia.

Apoderado:

- Consulta perfil.
- Consulta anotaciones.
- Consulta asistencia.

Alumno:

- Consulta su información académica, anotaciones y asistencia.

Actualmente no hay login real. Para EV2 se usa un selector de rol simulado, suficiente para demostrar separación de funciones por perfil.

## Rutas principales

- `/`: inicio.
- `/perfil`: perfil del estudiante.
- `/anotacion`: anotaciones del estudiante.
- `/asistencia`: asistencia del estudiante.
- `/registrar-anotacion`: registro de anotación.
- `/registrar-asistencia`: registro de asistencia.

## Rol dentro de la arquitectura

El flujo esperado es:

```text
Frontend React -> BFF -> ms-academico
                    |
                    -> ms-asistencia
```

El frontend no consume directamente los microservicios. Todas las llamadas pasan por el BFF.
