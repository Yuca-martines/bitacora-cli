## Selecion de Type commonjs o module

Selecione el module, ya que siento que al momento de trabajar se me hace mas organizado el Import y el Export de archivos. Aparte que es un Type al cual estoy mas acostumbrado de manejar.

# bitacora-cli

Una herramienta de línea de comandos en Node.js para gestionar notas y tareas personales. Permite agregar notas con identificadores únicos, filtrarlas por palabras clave, organizarlas con etiquetas, crear copias de respaldo y exportarlas en archivos de texto, llevando además una bitácora automática de todas las acciones realizadas.

---

## Instalación

1. Clona el repositorio o descarga el proyecto.
2. Abre una terminal en la carpeta raíz y ejecuta:

```bash
npm install
```

*(Si usas el paquete local de fechas, asegúrate de haber corrido `npm link` en la carpeta del paquete y `npm link fechas-bitacora-yuca-martines` aquí).*

---

## Comandos disponibles

| Comando | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `agregar "<texto>" [etiqueta]` | Guarda una nueva nota (etiqueta opcional, por defecto `general`). | `node src/index.js agregar "Terminar reporte" trabajo` |
| `listar [N]` | Muestra las últimas N notas (por defecto muestra 5). | `node src/index.js listar 3` |
| `buscar <palabra>` | Busca notas que contengan la palabra indicada. | `node src/index.js buscar reporte` |
| `borrar <id>` | Elimina una nota mediante su ID de 8 caracteres. | `node src/index.js borrar a1b2c3d4` |
| `respaldar` | Crea una copia con marca de tiempo de `notas.json` en `respaldos/`. | `node src/index.js respaldar` |
| `exportar [carpeta]` | Exporta las notas a un archivo de texto en una ruta absoluta (o en tu carpeta de usuario). | `node src/index.js exportar "C:\Users\Samuel\Documentos"` |
| `ayuda` | Muestra el menú de ayuda con la sintaxis de cada comando. | `node src/index.js ayuda` |

---
## Preguntas de reflexión

### 1. ¿Por qué elegiste CommonJS o ES Modules? ¿Qué cambió en tu package.json y en la forma de importar?
Elegí ES Modules porque es el estándar moderno de JavaScript y me resulta más cómodo y organizado trabajar con `import` y `export`. En el `package.json` fue necesario agregar la propiedad `"type": "module"`, y en el código cambió la forma de llamar a los archivos locales, ya que ahora es obligatorio incluir la extensión completa (por ejemplo `./notas.js` en lugar de solo `./notas`).

### 2. fs, object-hash y fechas (tu paquete) se importan distinto del módulo local notas.js. ¿Cuál es la diferencia y cómo decide Node dónde buscar cada uno?
La diferencia está en el prefijo de la ruta: los módulos locales llevan `./` o `../`, lo que le indica a Node que debe buscarlos en una ubicación relativa de nuestros archivos. Cuando no llevan punto ni barra diagonal, Node sabe que se trata de módulos nativos integrados en el sistema (como `fs`) o de librerías instaladas (como `object-hash` y el paquete enlazado), por lo que va y los busca directamente dentro de la carpeta `node_modules/`.

### 3. ¿Por qué data/notas.json se resuelve distinto si ejecutas el programa desde otra carpeta?
Porque si usamos una ruta relativa como `./data/notas.json`, Node la calcula tomando como punto de partida la carpeta donde tenemos abierta la terminal al ejecutar el comando (`process.cwd()`), no donde está guardado el script. Para evitar errores al movernos entre carpetas, usamos `path.join(import.meta.dirname, '..', 'data')`, lo que garantiza que la ruta siempre se construya fija a partir de la ubicación real de `almacen.js`.

### 4. ¿Por qué node_modules/ no se sube a Git y cómo recupera otra persona las dependencias?
No se sube porque es una carpeta muy pesada que contiene miles de archivos y librerías externas, lo que haría el repositorio gigante y lento de clonar. Otra persona no necesita que se la enviemos: basta con que clone el proyecto y ejecute `npm install`, ya que `package.json` y `package-lock.json` guardan el listado y las versiones exactas que deben descargarse.

### 5. ¿Qué diferencia viste al importar tu paquete CommonJS desde tu proyecto?
Aunque el paquete de fechas fue creado con CommonJS usando `module.exports`, desde mi proyecto principal pude usar la sintaxis moderna `import { getShortDate } from ...`. La diferencia práctica fue ver cómo Node.js hace de puente entre ambos sistemas sin problemas, permitiéndome desestructurar las funciones directamente con llaves sin tener que usar `require()`.