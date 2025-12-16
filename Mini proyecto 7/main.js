const readline = require("readline");
const Arbol = require("./src/Arbol");
const fs = require("fs");

const arbol = new Arbol();
let cwd = "/";

function resolverRuta(ruta) {
    if (!ruta) return null;
    if (ruta.startsWith("/")) return ruta;
    if (cwd === "/") return "/" + ruta;
    return cwd + "/" + ruta;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "FS> "
});

console.log("Mini-suite Árboles — Consola interactiva");
console.log("Escribe 'help' para ver comandos disponibles");
rl.prompt();

const comandos = {
    help() {
        console.log(`
mkdir <nombre>        Crear carpeta
touch <nombre>        Crear archivo
ls [ruta]             Listar hijos
cd <ruta>             Cambiar directorio
pwd                   Mostrar ruta actual
mv <origen> <dest>    Mover nodo
rename <ruta> <nuevo> Renombrar
rm <ruta>             Eliminar (a papelera)
trash                 Ver papelera
restore <nombre>      Restaurar de papelera
emptytrash            Vaciar papelera
search <nombre>       Búsqueda exacta
auto <prefijo>        Autocompletado
preorden              Mostrar preorden
save <archivo>        Guardar JSON
load <archivo>        Cargar JSON
exit                  Salir
`);
    },

    mkdir(args) {
        if (!args[0]) return console.log("Uso: mkdir <nombre>");
        arbol.insertar(cwd, args[0], "carpeta") ?
            console.log("Carpeta creada") :
            console.log("Error al crear carpeta");
    },

    touch(args) {
        if (!args[0]) return console.log("Uso: touch <nombre>");
        arbol.insertar(cwd, args[0], "archivo") ?
            console.log("Archivo creado") :
            console.log("Error al crear archivo");
    },

    ls(args) {
    const ruta = args[0] ? resolverRuta(args[0]) : cwd;
    const hijos = arbol.listarHijos(ruta);
    hijos ? console.log(hijos.join(" ")) : console.log("Ruta no válida");
    },

    cd(args) {
    if (!args[0]) return;
    const ruta = resolverRuta(args[0]);
    if (arbol.buscarPorRuta(ruta)) cwd = ruta;
    else console.log("Ruta no válida");
    },

    pwd() {
        console.log(cwd);
    },

    mv(args) {
    const origen = resolverRuta(args[0]);
    const destino = resolverRuta(args[1]);
    arbol.mover(origen, destino) ?
        console.log("Movido correctamente") :
        console.log("Error al mover");
    },

    rename(args) {
    const ruta = resolverRuta(args[0]);
    arbol.renombrar(ruta, args[1]) ?
        console.log("Renombrado") :
        console.log("Error al renombrar");
    },

    rm(args) {
    const ruta = resolverRuta(args[0]);
    arbol.eliminarConPapelera(ruta) ?
        console.log("Movido a papelera") :
        console.log("Error al eliminar");
    },

    trash() {
        console.log("Papelera:");
        arbol.papelera.children.forEach(n => console.log(n.nombre));
    },

    restore(args) {
        arbol.restaurar(args[0]) ?
            console.log("Restaurado") :
            console.log("Error al restaurar");
    },

    emptytrash() {
        arbol.vaciarPapelera();
        console.log("Papelera vacía");
    },

    search(args) {
        arbol.buscarExacto(args[0])
            .forEach(n => console.log(arbol.obtenerRutaCompleta(n)));
    },

    auto(args) {
        arbol.buscarPorPrefijo(args[0])
            .forEach(n => console.log(arbol.obtenerRutaCompleta(n)));
    },

    preorden() {
        console.log(arbol.preorden().join(" -> "));
    },

    save(args) {
        arbol.guardarJSON(args[0]);
        console.log("Guardado");
    },

    load(args) {
        arbol.cargarJSON(args[0]);
        console.log("Cargado");
    }
};

rl.on("line", line => {
    const [cmd, ...args] = line.trim().split(" ");
    if (cmd === "exit") return rl.close();
    comandos[cmd] ? comandos[cmd](args) :
        console.log("Comando desconocido");
    rl.prompt();
});