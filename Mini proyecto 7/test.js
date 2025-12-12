const assert = require("assert");
const Arbol = require("./src/Arbol");

console.log("-- Pruebas de Integración --");

const arbol = new Arbol();

const doc = arbol.insertar("/", "Documentos", "carpeta");
const img = arbol.insertar("/", "Imagenes", "carpeta");
arbol.insertar("/Documentos", "notas.txt", "archivo", "contenido");
arbol.insertar("/Imagenes", "foto.png", "archivo");

assert(doc !== null, "Documentos no se creó");
assert(img !== null, "Imagenes no se creó");

const pre = arbol.preorden();
assert(pre.includes("Documentos"), "Preorden no contiene Documentos");

let exacto = arbol.buscarExacto("notas.txt");
assert(exacto.length === 1, "Busqueda exacta falló");

let auto = arbol.buscarPorPrefijo("no");
assert(auto.length === 1, "Autocompletado falló");

arbol.mover("/Documentos/notas.txt", "/Imagenes");
assert(
    arbol.buscarPorRuta("/Imagenes/notas.txt") !== null,
    "No se movió correctamente"
);

arbol.renombrar("/Imagenes/notas.txt", "apuntes.txt");
assert(
    arbol.buscarPorRuta("/Imagenes/apuntes.txt") !== null,
    "Renombrado falló"
);

arbol.eliminarConPapelera("/Imagenes/apuntes.txt");
assert(
    arbol.papelera.children.find(n => n.nombre === "apuntes.txt"),
    "No se movió a papelera"
);

arbol.restaurar("apuntes.txt");
assert(
    arbol.buscarPorRuta("/Imagenes/apuntes.txt") !== null,
    "Restaurar falló"
);

arbol.guardarJSON("test_arbol.json");

const arbol2 = new Arbol();
arbol2.cargarJSON("test_arbol.json");

assert(
    arbol2.buscarPorRuta("/Imagenes/apuntes.txt") !== null,
    "Persistencia falló"
);

console.log("Todas las pruebas de integración pasaron correctamente\n");


console.log("-- Pruebas de Casos Límite --");

assert(!arbol.eliminarConPapelera("/"), "No debe permitir eliminar raíz");

arbol.insertar("/", "Duplicado", "carpeta");
let repetido = arbol.insertar("/", "Duplicado", "carpeta");
assert(repetido !== null, "Se permite nombre duplicado (válido)");

assert(!arbol.mover("/Duplicado", "/Duplicado"), "No debe mover a sí mismo");

assert(!arbol.restaurar("noexiste.txt"), "No debe restaurar inexistente");

console.log("Todas las pruebas de casos limite pasaron correctamente\n");


console.log("-- Pruebas de Performance --");

const arbolBig = new Arbol();
const N = 20000;

console.log("Insertando " + N + " nodos…");

console.time("insertar");
for (let i = 0; i < N; i++)
    arbolBig.insertar("/", "nodo" + i, "archivo");
console.timeEnd("insertar");

console.time("buscarExacto");
arbolBig.buscarExacto("nodo19999");
console.timeEnd("buscarExacto");

console.time("trie_auto");
arbolBig.buscarPorPrefijo("nodo1");
console.timeEnd("trie_auto");

console.log("Todas las pruebas de rendimiento pasaron correctamente");
