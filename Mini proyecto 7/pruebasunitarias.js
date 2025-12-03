const assert = require("assert");
const Arbol = require("./Arbol");

console.log("\n Pruebas Iniciales Día 2–3 ");

const arbol = new Arbol();

// prueba: Insertar y buscar
arbol.insertar("/", "Documentos", "carpeta");
assert(arbol.buscarPorRuta("/Documentos") !== null, "Documentos debe existir");

// insertar archivo
arbol.insertar("/Documentos", "notas.txt", "archivo", "contenido");
assert(arbol.buscarPorRuta("/Documentos/notas.txt") !== null, "Archivo debe existir");

console.log("✔ Inserción OK");

// prueba: listar hijos
const hijos = arbol.listarHijos("/Documentos");
assert(hijos.includes("notas.txt"), "Debe listar notas.txt");
console.log("✔ Listar hijos OK");

// prueba: obtener ruta completa
const nodo = arbol.buscarPorRuta("/Documentos/notas.txt");
assert(arbol.obtenerRutaCompleta(nodo) === "/Documentos/notas.txt", "Ruta completa incorrecta");
console.log("✔ Ruta completa OK");

// prueba: preorden
const pre = arbol.preorden();
assert(pre.length === 3, "Preorden debe tener 3 elementos");
console.log("✔ Preorden OK");

// prueba: renombrar
arbol.renombrar("/Documentos", "Docs");
assert(arbol.buscarPorRuta("/Docs") !== null, "Debió renombrarse");
console.log("✔ Renombrar OK");

// prueba: mover
arbol.mover("/Docs/notas.txt", "/");
assert(arbol.buscarPorRuta("/notas.txt") !== null, "Archivo debe moverse al root");
console.log("✔ Mover OK");

// prueba: tamaño y altura
assert(arbol.tamaño() === 3, "El tamaño debe ser 3");
assert(arbol.altura() >= 1, "La altura debe ser >= 1");
console.log("✔ Tamaño y altura OK");

// prueba: eliminar
arbol.eliminar("/Docs");
assert(arbol.buscarPorRuta("/Docs") === null, "Se debe eliminar Docs");
console.log("✔ Eliminar OK");

console.log("\n>>> TODAS LAS PRUEBAS PASARON ✔✔✔\n");
