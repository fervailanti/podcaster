<img height="80" alt="Podcaster icon" src="src/app/icon.svg" />

# Podcaster

### [English](README.md) · **Español**

Podcaster permite explorar los [**100 podcasts de música más populares**](https://podcasts.apple.com/us/charts) de Apple desde una interfaz adaptable. Puedes filtrarlos por título o autor, consultar sus episodios disponibles y escucharlos con el reproductor de audio nativo del navegador. La interfaz está disponible en inglés y español.

El proyecto está desarrollado con Next.js, React, TypeScript, TanStack Query, i18next y CSS Modules.

**Demo publicada:** [podcaster-ten.vercel.app](https://podcaster-ten.vercel.app)

## Primeros pasos

Necesitas Node.js **20.9 o posterior** y npm.

```bash
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). No hacen falta claves de API ni variables de entorno.

Para ejecutar localmente la versión de producción:

```bash
npm run build
npm start
```

## Comandos disponibles

| Comando                | Función                                     |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Inicia el servidor de desarrollo de Next.js |
| `npm run build`        | Genera la versión de producción             |
| `npm start`            | Sirve la versión de producción              |
| `npm run typecheck`    | Comprueba los tipos de TypeScript           |
| `npm run lint`         | Ejecuta ESLint y las reglas de formato      |
| `npm test`             | Ejecuta los tests de Vitest                 |
| `npm run format`       | Formatea el proyecto con Prettier           |
| `npm run format:check` | Comprueba el formato sin modificar archivos |

## Funcionamiento de la aplicación

| Ruta                                       | Pantalla                                         |
| ------------------------------------------ | ------------------------------------------------ |
| `/`                                        | Top 100 de podcasts de música y filtro por texto |
| `/podcast/[podcastId]`                     | Información del podcast y episodios disponibles  |
| `/podcast/[podcastId]/episode/[episodeId]` | Descripción del episodio y reproductor de audio  |

La portada muestra los 100 podcasts de música más populares del listado estadounidense de Apple. El buscador filtra al instante los resultados descargados por título o autor, sin distinguir mayúsculas ni acentos; no busca en todo el catálogo de Apple. Al seleccionar un podcast se abre su detalle, con la imagen, el autor y la descripción disponibles junto a los episodios recientes devueltos por Apple. El detalle de un episodio muestra su descripción, fecha de publicación, duración y, si existe una URL de audio, el reproductor nativo.

El selector de idioma cambia la interfaz entre inglés y español. En la esquina superior derecha del encabezado fijo, junto al selector, aparece un pequeño **spinner** cuando una navegación iniciada en el cliente espera los datos de la pantalla de destino. La aplicación muestra mensajes específicos para búsquedas sin resultados, errores de petición, episodios no disponibles y ausencia de audio.

Los textos de la interfaz y los metadatos de cada página están traducidos. Los títulos, autores y descripciones de los podcasts se muestran en el idioma en que Apple los proporciona.

### Por qué no hay paginación de episodios

El ejemplo de la prueba usa `limit=20` en la petición de detalle, y esta implementación sigue ese criterio. La consulta devuelve un único conjunto de episodios recientes; la aplicación no dispone de una petición para obtener el resto del archivo de un podcast. Paginar localmente esos resultados daría a entender que también se puede acceder a episodios anteriores. Por eso, el detalle distingue entre el **total informado por Apple** y la **cantidad de episodios recibidos**, y los presenta como los últimos disponibles. Para incorporar un archivo completo haría falta primero una fuente fiable de episodios anteriores y después una paginación real de esos datos.

## Arquitectura

Es una aplicación Next.js pequeña, **organizada por capas y compuesta con componentes**. App Router define las rutas; la capa de datos concentra la comunicación con Apple; las pantallas componen cada vista; y los componentes compartidos resuelven la presentación reutilizable. Las capas se mantienen simples, sin añadir servicios, repositorios o una estructura de features que solo reenviaría llamadas.

### Estructura del proyecto

```text
src/
  app/          Rutas de Next.js, layout principal y precarga en el servidor
  api/          Peticiones a Apple, tipos de respuesta, mappers y consultas
    tanstack/   Query client, persistencia e hidratación
  components/   Componentes reutilizables y sus CSS Modules
  screens/      Composición de las pantallas de inicio, podcast y episodio
  i18n/         Idiomas, traducciones JSON y metadatos
  navigation/   Enlaces y estado de carga durante la navegación
  styles/       Estilos globales, layout compartido y tokens de diseño
  utils/        Formato de fechas/duraciones y búsqueda sin acentos
```

Los archivos de `src/app` resuelven los parámetros de ruta, seleccionan los metadatos y precargan la consulta correspondiente. Las pantallas de `src/screens` componen la interfaz y mantienen el estado propio de cada vista, como el texto del buscador. La capa de datos define las URL de Apple, los tipos de respuesta, las funciones de petición y la transformación de datos. Los componentes compartidos reciben propiedades de presentación en lugar de respuestas de Apple: `SummaryCard` recibe título, imagen y caption; `Sidebar`, título, subtítulo y contenido.

Estas decisiones se reflejan en el código:

- **Transformación en el límite de la API:** `src/api/mappers` convierte las respuestas de Apple en `PodcastSummary`, `PodcastDetail` y `Episode` antes de entregarlas a las pantallas. Así, los nombres de campos específicos de Apple no llegan a la interfaz.
- **Definición única de las consultas:** `src/api/queries.ts` declara las claves y funciones tipadas que comparten la precarga del servidor y `useQuery` en el cliente.
- **Composición de componentes:** `Card`, `Artwork`, `Sidebar` y `SummaryCard` forman piezas reutilizables. Cada pantalla aporta sus textos, rutas y contenido.
- **Estado cerca de quien lo utiliza:** la búsqueda vive en `HomeScreen`; TanStack Query gestiona los datos remotos; React Context solo gestiona el progreso de navegación.
- **Estilos junto a los componentes:** cada componente conserva su CSS Module al lado del TSX. Los tokens y las reglas de layout realmente compartidas están en `src/styles`.

El código de la aplicación está tipado con TypeScript/TSX, incluidos los tipos de respuesta, los modelos de dominio y las propiedades de los componentes. Se prioriza la legibilidad y la posibilidad de ampliar el proyecto cuando aparezca un caso de uso real. El JSON de Apple se transforma y se comprueban sus campos necesarios, aunque no se valida por completo con un esquema en tiempo de ejecución.

## SSR, flujo de datos y caché

1. Una página de servidor de Next.js entrega a `PrefetchBoundary` una consulta definida en `src/api/queries.ts`. Se crea un `QueryClient` nuevo para cada renderizado en el servidor, de modo que la caché no se comparte entre peticiones.
2. La consulta usa `fetch` para solicitar el feed RSS o el detalle del podcast a Apple. Los mappers transforman la respuesta a los tipos de la aplicación y sanean las descripciones antes de mostrarlas.
3. `PrefetchBoundary` deshidrata la caché de consultas en la página renderizada. La pantalla cliente llama a `useQuery` con la **misma clave de consulta**, por lo que la hidratación reutiliza los datos precargados sin repetir inmediatamente la petición.
4. En las siguientes navegaciones desde el cliente se reutilizan los datos recientes, se solicitan los que falten o hayan caducado y se persiste la caché de consultas en `localStorage` cuando está disponible.

El listado principal usa el feed estadounidense de podcasts de música de Apple. El detalle utiliza el endpoint de lookup con `media=podcast`, `entity=podcastEpisode` y `limit=20`. También consulta el listado principal mediante TanStack Query para reutilizar su descripción cuando el podcast está incluido en él. Por eso, una visita directa al detalle puede necesitar ambas respuestas de Apple, mientras que una visita posterior puede aprovechar el listado ya guardado en caché. Si un podcast no está entre los 100 primeros, es posible que no haya una descripción para la barra lateral.

La política de caché está centralizada en `src/api/config.ts`:

- TanStack Query usa un **`staleTime` de 24 horas**: los datos recientes no se vuelven a solicitar solo porque un componente se monte otra vez.
- Su **`gcTime` de 24 horas** controla cuánto tiempo pueden permanecer en memoria las consultas sin uso. La persistencia del navegador aplica un **`maxAge` de 24 horas** a los datos guardados.
- Las peticiones `fetch` del servidor piden a Next.js **revalidar después de 24 horas**. Esta caché es independiente de la caché de TanStack Query en el cliente.
- Los reintentos automáticos están desactivados, así que un error de Apple llega al estado de error de la pantalla sin repetir la petición.

La aplicación consulta Apple directamente: no utiliza una ruta API interna ni un proxy CORS público. Si el almacenamiento del navegador no está disponible, las peticiones siguen funcionando sin persistencia. Esta configuración reduce las peticiones repetidas y establece un intervalo de actualización predecible; no garantiza que el contenido de Apple permanezca inalterado durante ese tiempo.

Las imágenes del listado principal se cargan de forma diferida al entrar en pantalla; la imagen destacada de un detalle se carga de forma prioritaria. El elemento de audio precarga sus metadatos para poder mostrar la duración antes de iniciar la reproducción sin descargar previamente el episodio completo.

### Por qué TanStack Query

Un mismo podcast puede abrirse desde distintas rutas, y tanto el renderizado en el servidor como la navegación en el cliente necesitan sus datos. TanStack Query aporta claves estables, deduplicación de peticiones, control de vigencia de la caché, estados de carga y error, persistencia e hidratación sin mantener una implementación propia de caché. `src/api/queries.ts` reúne las dos consultas e infiere el tipo de sus resultados a partir de las funciones que las ejecutan.

**Context API se usa para el progreso de navegación.** `NavigationLink` activa el estado pendiente al seleccionar una nueva ruta. Cada pantalla llama a `useNavigationComplete` cuando su consulta deja de estar pendiente. `Header` lee ese contexto y muestra el spinner junto al selector de idioma. De este modo, el indicador funciona entre rutas sin almacenar los datos de los podcasts en Context.

## Decisiones de renderizado y estilos

### Next.js App Router

App Router proporciona las rutas solicitadas y una entrada renderizada en el servidor. Cada página precarga sus datos antes de renderizar la pantalla cliente y después hidrata TanStack Query en el navegador. El layout principal determina el idioma del HTML inicial; cada página genera metadatos traducidos para su ruta sin hacer otra petición a Apple. Las pantallas son componentes cliente porque usan `useQuery`, i18next y estado de interacción local. Las páginas de servidor se ocupan de los parámetros de ruta y la precarga.

### CSS Modules

CSS Modules permite colocar los estilos junto al componente y limita el alcance de los nombres de clase. Esto facilita mover y reutilizar piezas de interfaz sin colisiones accidentales entre selectores. También mantiene las reglas de layout cerca del componente que las utiliza, evitando concentrarlas todas en una hoja global.

El pequeño sistema de diseño tiene dos partes:

- `src/styles/globals.css` es la fuente de los valores CSS usados en ejecución: colores, escala de espaciado, tamaños e interlineados de texto, radios, sombras y estilos de foco. También contiene el reset y las reglas globales de la página.
- `src/styles/theme.ts` expone los nombres de esas variables mediante un objeto tipado para TypeScript. Hace referencia a las variables CSS sin duplicar sus valores; actualmente, los CSS Modules de los componentes consumen esas variables directamente.

Componentes reutilizables como `Card`, `Eyebrow`, `SectionHeading`, `SearchBar` y `EmptyState` aplican los tokens de forma consistente. Las pantallas los combinan y añaden únicamente sus propias reglas de distribución. Así, tipografía, espaciado y estados de interacción mantienen una apariencia coherente, y los ajustes de paleta o escala se hacen desde un lugar central. El layout compartido de dos columnas para los detalles está en `src/styles/DetailLayout.module.css`.

### Internacionalización

El inglés es el idioma predeterminado. Las traducciones están en `src/i18n/translations/en.json` y `es.json`; los idiomas admitidos y el nombre de la cookie se centralizan en `src/i18n/config.ts`. El selector actualiza i18next, el idioma del documento y una cookie. El servidor lee esa cookie para establecer el idioma del HTML inicial y los metadatos de cada ruta. Las fechas utilizan el idioma activo de la interfaz; las duraciones mantienen el formato `mm:ss` o `h:mm:ss`.

### Contenido externo

Las descripciones de los episodios están preparadas para mostrar HTML, incluidos párrafos, énfasis y enlaces. Los mappers procesan ese contenido con `sanitize-html` antes de que la interfaz lo renderice, eliminando etiquetas y enlaces inseguros. Durante la revisión de datos para esta prueba, casi todas las descripciones de episodios examinadas llegaron como texto plano, por lo que esta capacidad apenas se aprecia al navegar. Un test con enlaces y formato válidos, además de contenido inseguro, comprueba ese recorrido aunque los datos reales apenas lo utilicen.

Solo se aceptan URL de audio que usen HTTPS. La reproducción utiliza `<audio controls>` nativo, con soporte de teclado y controles familiares para el navegador. El buscador y el selector de idioma tienen etiquetas accesibles; los elementos interactivos muestran estilos de foco visibles.

## Tests y comprobaciones

La suite de Vitest se centra en los límites y comportamientos con mayor riesgo de regresión:

| Área                   | Casos cubiertos                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| Mappers de Apple       | Transformación del feed, total de episodios informado, HTML seguro y eliminación de contenido dañino |
| Consultas y caché      | Reutilización del listado en el detalle, clientes de consulta independientes en el servidor          |
| Utilidades de petición | Respuestas JSON, errores HTTP, revalidación del servidor y validación del ID del podcast             |
| Formato                | Duraciones, redondeo, valores inválidos y fechas traducidas                                          |
| Búsqueda               | Coincidencias sin distinguir acentos, mayúsculas o espacios; búsquedas vacías y sin resultados       |

Son tests unitarios y de consultas enfocados en casos concretos; no pretenden cubrir un flujo completo de navegador. Puedes ejecutar las comprobaciones con:

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
```

La configuración de formato y lint busca que las revisiones se centren en el comportamiento:

- Prettier usa un ancho de 100 caracteres, indentación de dos espacios, comillas simples en el código, dobles en JSX, punto y coma y ningún separador final.
- ESLint incluye las reglas de Next.js y TypeScript; `eslint-config-prettier` evita conflictos con Prettier. Otras reglas detectan imports duplicados o sin uso, ordenan imports y exports, priorizan las arrow functions y rechazan espacios sobrantes.
- La configuración de VS Code activa el formato y las correcciones de ESLint al guardar. Para integrarlo en ese editor hace falta la extensión **Prettier - Code formatter**; los comandos de terminal solo usan las dependencias locales del proyecto.

## Despliegue

El proyecto se despliega desde `main` en [podcaster-ten.vercel.app](https://podcaster-ten.vercel.app) mediante la integración de GitHub con Vercel. Vercel detecta Next.js y usa su configuración de compilación de producción predeterminada. No se necesitan secretos de aplicación. Apple debe ser accesible desde el entorno de despliegue, y la reproducción depende de las URL de audio que proporcione.

### CI/CD y checks de despliegue

Cada cambio se valida antes de poder publicarse en los alias de producción:

1. Un push a `main` o un pull request inicia el workflow de GitHub Actions **Validate**. Ejecuta `npm ci`, ESLint, TypeScript, Prettier, Vitest y una compilación de producción.
2. Un push a `main` también crea un despliegue de producción de Vercel desde el repositorio conectado.
3. Cuando Vercel termina de compilar ese despliegue, emite `vercel.deployment.ready`. El workflow **Deployment check** recibe el evento, obtiene el SHA exacto desplegado y repite la misma suite de validación.
4. Su paso `vercel/repository-dispatch/actions/status@v1` comunica el resultado como **`Vercel - podcaster: validate`**. Vercel exige ese estado de GitHub antes de asignar los alias de producción.

Los dos workflows cubren momentos distintos del proceso de publicación. **Validate** da feedback inmediato para un push o pull request. **Deployment check** valida la revisión exacta que Vercel ha compilado y decide si puede promocionarse a producción. Vercel lo tiene configurado como un Deployment Check de GitHub que bloquea `deployment-alias` en producción hasta que termina correctamente.
