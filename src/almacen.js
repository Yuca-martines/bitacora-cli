import fs from "fs";
import path from "path";
import os from "os";
import Fecha from "./fechas.js";

const FolderName = path.join(import.meta.dirname, "..", "data");
const FileName = path.join(FolderName, 'notas.json');
const BitLog = path.join(FolderName, "bitacora.log");
const RespaldosFolder = path.join(import.meta.dirname, "..", "respaldos");
const SalidaFolder = path.join(import.meta.dirname, "..", "salida");

function AsegurarArchivo() {
    fs.mkdirSync(FolderName, { recursive: true });

    if (!fs.existsSync(FileName))
        fs.writeFileSync(FileName, "[]");
}

export function LeerNotas() {
    AsegurarArchivo();
    const contenido = fs.readFileSync(FileName, "utf-8");

    let notas
    try {
        notas = JSON.parse(contenido);
    } catch {
        throw new Error(`Hay un error en el archivo ${FileName}. Borralo o corrigelo.`);
    }

    if (!Array.isArray(notas)) {
        throw new Error(`El archivo ${FileName} no es un array de notas.`);
    }

    return notas;
}

export function guardarNotas(notas) {
    fs.writeFileSync(FileName, JSON.stringify(notas));
}

export function registrarAccion(comando, resultado) {
    fs.mkdirSync(FolderName, { recursive: true });
    const linea = `${Fecha()} | ${comando} | ${resultado}\n`;
    fs.appendFileSync(BitLog, linea);
}

export function respaldar() {
    AsegurarArchivo();
    fs.mkdirSync(RespaldosFolder, { recursive: true });

    const marcaDeTiempo = Date.now();
    const nombreArchivo = `notas_${marcaDeTiempo}.json`;
    const rutaDestino = path.join(RespaldosFolder, nombreArchivo);

    fs.copyFileSync(FileName, rutaDestino);
    return `Respaldo creado exitosamente en: respaldos/${nombreArchivo}`;
}

export function exportar(carpetaDestino) {
    const destino = carpetaDestino || os.homedir();

    if (!path.isAbsolute(destino)) {
        return `Error: La ruta de destino "${destino}" debe ser absoluta.`;
    }

    if (!fs.existsSync(destino) || !fs.statSync(destino).isDirectory()) {
        return `Error: La carpeta de destino "${destino}" no existe.`;
    }

    fs.mkdirSync(SalidaFolder, { recursive: true });
    const archivoOrigen = path.join(SalidaFolder, "exportacion.txt");

    const notas = LeerNotas();
    let contenido = "=== BITÁCORA DE NOTAS ===\n\n";

    if (notas.length === 0) {
        contenido += "No hay notas registradas.\n";
    } else {
        contenido += notas.map((n, i) =>
            `Nota #${i + 1}\nID: ${n.id}\nFecha: ${n.fecha}\nEtiqueta: ${n.etiqueta}\nTexto: ${n.texto}\n----------------------------------------`
        ).join("\n\n") + "\n";
    }

    fs.writeFileSync(archivoOrigen, contenido, "utf-8");

    const archivoDestino = path.join(destino, "exportacion.txt");

    try {
        fs.renameSync(archivoOrigen, archivoDestino);
    } catch (error) {
        if (error.code === "EXDEV") {
            fs.copyFileSync(archivoOrigen, archivoDestino);
            fs.unlinkSync(archivoOrigen);
        } else {
            throw error;
        }
    }

    return `Notas exportadas exitosamente a: ${archivoDestino}`;
}