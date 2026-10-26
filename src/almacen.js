import fs from "fs";
import path from "path";
import Fecha from "./fechas.js";

const FolderName = path.join(import.meta.dirname, "..", "data");
const FileName = path.join(FolderName, 'notas.json');
const BitLog = path.join(FolderName, "bitacora.log")

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