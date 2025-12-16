const Node = require("./Node");
const Trie = require("./Trie");
const fs = require("fs");

class Arbol {
    constructor() {
        this.root = new Node(0, "/", "carpeta");
        this.lastId = 0;

        this.hash = new Map();
        this.trie = new Trie();

        this.papelera = new Node(-1, "Papelera", "carpeta", "", this.root);
        this.root.children.push(this.papelera);

        this._agregarAIndices(this.root);
        this._agregarAIndices(this.papelera);
    }

    generarId() {
        this.lastId++;
        return this.lastId;
    }

    _agregarAIndices(nodo) {
        if (!this.hash.has(nodo.nombre))
            this.hash.set(nodo.nombre, []);
        this.hash.get(nodo.nombre).push(nodo);
        this.trie.insertar(nodo.nombre, nodo);
    }

    _removerDeIndices(nodo) {
        if (this.hash.has(nodo.nombre)) {
            this.hash.set(
                nodo.nombre,
                this.hash.get(nodo.nombre).filter(n => n !== nodo)
            );
            if (this.hash.get(nodo.nombre).length === 0)
                this.hash.delete(nodo.nombre);
        }
        this.trie.eliminar(nodo.nombre, nodo);
    }

    _actualizarNombreIndices(nodo, viejo, nuevo) {
        this._removerDeIndices(nodo);
        nodo.nombre = nuevo;
        this._agregarAIndices(nodo);
    }

    buscarPorRuta(ruta) {
        if (ruta === "/") return this.root;
        const partes = ruta.split("/").filter(Boolean);
        let actual = this.root;

        for (const nombre of partes) {
            actual = actual.children.find(h => h.nombre === nombre);
            if (!actual) return null;
        }
        return actual;
    }

    insertar(rutaPadre, nombre, tipo, contenido = "") {
        const padre = this.buscarPorRuta(rutaPadre);
        if (!padre) return null;

        const nuevo = new Node(this.generarId(), nombre, tipo, contenido, padre);
        padre.children.push(nuevo);
        this._agregarAIndices(nuevo);
        return nuevo;
    }

    listarHijos(ruta) {
        const nodo = this.buscarPorRuta(ruta);
        return nodo ? nodo.children.map(h => h.nombre) : null;
    }

    obtenerRutaCompleta(nodo) {
        const partes = [];
        while (nodo.parent) {
            partes.push(nodo.nombre);
            nodo = nodo.parent;
        }
        return "/" + partes.reverse().join("/");
    }

    preorden(nodo = this.root, res = []) {
        res.push(nodo.nombre);
        nodo.children.forEach(h => this.preorden(h, res));
        return res;
    }

    eliminarConPapelera(ruta) {
        const nodo = this.buscarPorRuta(ruta);
        if (!nodo || nodo === this.root || nodo === this.papelera) return false;

        nodo._rutaOriginal = this.obtenerRutaCompleta(nodo);
        nodo.parent.children = nodo.parent.children.filter(h => h !== nodo);
        nodo.parent = this.papelera;
        this.papelera.children.push(nodo);
        return true;
    }

    restaurar(nombre) {
        const nodo = this.papelera.children.find(n => n.nombre === nombre);
        if (!nodo || !nodo._rutaOriginal) return false;

        const partes = nodo._rutaOriginal.split("/").filter(Boolean);
        partes.pop();
        const padre = partes.length === 0 ? this.root : this.buscarPorRuta("/" + partes.join("/"));
        if (!padre) return false;

        this.papelera.children = this.papelera.children.filter(n => n !== nodo);
        nodo.parent = padre;
        padre.children.push(nodo);
        delete nodo._rutaOriginal;
        return true;
    }

    vaciarPapelera() {
        for (const n of this.papelera.children) {
            this._removerDeIndices(n);
        }
        this.papelera.children = [];
    }

    buscarExacto(nombre) {
        return this.hash.get(nombre) || [];
    }

    buscarPorPrefijo(prefijo) {
        return this.trie.autocompletar(prefijo);
    }

    renombrar(ruta, nuevo) {
        const nodo = this.buscarPorRuta(ruta);
        if (!nodo || nodo === this.root || nodo === this.papelera) return false;
        this._actualizarNombreIndices(nodo, nodo.nombre, nuevo);
        return true;
    }

    mover(origen, destino) {
        const nodo = this.buscarPorRuta(origen);
        const dest = this.buscarPorRuta(destino);
        if (!nodo || !dest || nodo === this.root) return false;

        nodo.parent.children = nodo.parent.children.filter(h => h !== nodo);
        nodo.parent = dest;
        dest.children.push(nodo);
        return true;
    }

    guardarJSON(ruta) {
        const data = {
            proyecto: "mini-suite-arboles",
            ultima_id: this.lastId,
            root: this._nodoToJSON(this.root)
        };
        fs.writeFileSync(ruta, JSON.stringify(data, null, 2));
    }

    _nodoToJSON(nodo) {
        const json = {
            id: nodo.id,
            nombre: nodo.nombre,
            tipo: nodo.tipo,
            contenido: nodo.contenido,
            children: nodo.children.map(h => this._nodoToJSON(h))
        };
        if (nodo._rutaOriginal) json._rutaOriginal = nodo._rutaOriginal;
        return json;
    }

    cargarJSON(ruta) {
        const data = JSON.parse(fs.readFileSync(ruta));

        this.lastId = data.ultima_id;
        this.hash = new Map();
        this.trie = new Trie();

        this.root = this._jsonToNodo(data.root, null);
        this.papelera = this.buscarPorRuta("/Papelera");
    }

    _jsonToNodo(obj, parent) {
        const nodo = new Node(obj.id, obj.nombre, obj.tipo, obj.contenido, parent);
        if (obj._rutaOriginal) nodo._rutaOriginal = obj._rutaOriginal;

        this._agregarAIndices(nodo);
        nodo.children = obj.children.map(h => this._jsonToNodo(h, nodo));
        return nodo;
    }
}

module.exports = Arbol;

