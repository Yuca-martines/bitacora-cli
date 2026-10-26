import { agregar, listar, buscar, borrar, respaldar, exportar } from "./notas.js"
import { registrarAccion } from "./almacen.js"

const [comando, ...args] = process.argv.slice(2);

function ayuda() {
    console.log("Uso: bitacora-cli <comando> [argumentos]")
    console.log("")
    console.log("Comandos disponibles:")
    console.log("  agregar <texto> [etiqueta] - Agrega una nueva nota")
    console.log("  listar [numero] - Lista las ultimas notas")
    console.log("  buscar <palabra> - Busca notas por palabra")
    console.log("  borrar <id> - Borra una nota por id")
    console.log("  respaldar - Guarda una copia de respaldo de notas.json")
    console.log("  exportar [carpeta-destino] - Exporta las notas a un archivo de texto")
    console.log("")
}

let resultado;

try {
    switch (comando) {
        case "agregar":
            resultado = agregar(args[0], args[1]);
            break;
        case "listar":
            resultado = listar(args[0]);
            break;
        case "buscar":
            resultado = buscar(args[0]);
            break;
        case "borrar":
            resultado = borrar(args[0]);
            break;
        case "respaldar":
            resultado = respaldar();
            break;
        case "exportar":
            resultado = exportar(args[0]);
            break;
        case "ayuda":
            resultado = ayuda();
            break;
        default:
            ayuda();
            console.log(`Comando desconocido: "${comando}"\n`);
    }
} catch (error) {
    console.log(error.message);
}

if (resultado !== undefined) {
    console.log(resultado.salida ?? resultado.mensaje ?? resultado);
}

try {
    registrarAccion(comando ?? "(sin comando)", resultado?.mensaje ?? resultado);
} catch (error) {
    console.log(`Aviso: no se pudo escribir en la bitácora (${error.message})`);
}