import hash from "object-hash";
import Fecha from "./fechas.js";
import { LeerNotas, guardarNotas } from "./almacen.js";

const LimitePorDefecto = 5;

export function agregar(texto, etiqueta = "general") {

    if (!texto?.trim()) {
        throw new Error("Debes agregar texto a la nota");
    }

    const textoLimpio = texto.trim();

    const hashtexto = hash(textoLimpio).slice(0, 8);

    const notas = LeerNotas();

    const repetida = notas.find((nota) => nota.id === hashtexto);
    if (repetida) {
        console.log("Ya existe una nota con ese id.");
        return repetida;
    }

    const nota = {
        id: hashtexto,
        texto: textoLimpio, etiqueta,
        fecha: Fecha()
    };

    notas.push(nota);
    guardarNotas(notas);

    return nota;
}

export function listar(entrada) {
    let n = LimitePorDefecto;
    let aviso = "";

    if (entrada !== undefined) {
        const numero = Number(entrada);

        if (Number.isInteger(numero) && numero > 0) {
            n = numero;
        } else {
            aviso = `Se ignoro el valor: "${entrada}", se utilizo el valor por defecto ${n}`;
        }
    }

    const notas = LeerNotas().slice(-n);
    return { notas, aviso }
}

export function buscar(palabra) {
    if (!palabra?.trim()) {
        return "Debes indicar una palabra para buscar";
    }

    const palabraBuscar = palabra.trim().toLowerCase();
    const notas = LeerNotas();
    const filtradas = notas.filter((nota) => nota.texto.includes(palabraBuscar));

    return { notas: filtradas, aviso: "" }
}


export function borrar(id) {
    if (!id?.trim()) {
        return "Debes indicar un id para borrar una nota"
    }

    const notas = LeerNotas();
    if (!notas.some((nota) => nota.id === id)) {
        return `No exixte ninguna nota con este id ${id}`
    }

    const filtradas = notas.filter((nota) => nota.id != id)
    guardarNotas(filtradas);

    return `Se borro la nota con id ${id}`;
}
