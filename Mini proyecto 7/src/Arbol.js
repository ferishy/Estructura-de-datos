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

    _actualizarNombreIndices(nodo, viejoNombre, nuevoNombre) {
        if (this.hash.has(viejoNombre)) {
            this.hash.set(
                viejoNombre,
                this.hash.get(viejoNombre).filter(n => n !== nodo)
            );
            if (this.hash.get(viejoNombre).length === 0)
                this.hash.delete(viejoNombre);
        }
        this.trie.eliminar(viejoNombre, nodo);

        if (!this.hash.has(nuevoNombre))
            this.hash.set(nuevoNombre, []);
        this.hash.get(nuevoNombre).push(nodo);

        this.trie.insertar(nuevoNombre, nodo);
    }

    buscarPorRuta(ruta) {
        if (ruta === "/") return this.root;

        const partes = ruta.split("/").filter(x => x !== "");
        let actual = this.root;

        for (const nombre of partes) {
            const encontrado = actual.children.find(h => h.nombre === nombre);
            if (!encontrado) return null;
            actual = encontrado;
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
        if (!nodo) return null;
        return nodo.children.map(h => h.nombre);
    }

    obtenerRutaCompleta(nodo) {
        let actual = nodo;
        const partes = [];

        while (actual.parent) {
            partes.push(actual.nombre);
            actual = actual.parent;
        }

        return "/" + partes.reverse().join("/");
    }

    preorden(nodo = this.root, resultado = []) {
        resultado.push(nodo.nombre);
        for (const h of nodo.children) {
            this.preorden(h, resultado);
        }
        return resultado;
    }

    eliminarConPapelera(ruta) {
        const nodo = this.buscarPorRuta(ruta);
        if (!nodo || nodo === this.root || nodo === this.papelera)
            return false;

        nodo._rutaOriginal = this.obtenerRutaCompleta(nodo);

        nodo.parent.children =
            nodo.parent.children.filter(h => h !== nodo);

        nodo.parent = this.papelera;
        this.papelera.children.push(nodo);
        return true;
    }

    restaurar(nombre) {
        const nodo = this.papelera.children.find(n => n.nombre === nombre);
        if (!nodo || !nodo._rutaOriginal) return false;

        const partes = nodo._rutaOriginal.split("/").filter(x => x !== "");
        partes.pop();

        const rutaPadre = "/" + partes.join("/");
        const padre = rutaPadre === "/" ? this.root : this.buscarPorRuta(rutaPadre);
        if (!padre) return false;

        this.papelera.children =
            this.papelera.children.filter(n => n !== nodo);

        nodo.parent = padre;
        padre.children.push(nodo);
        delete nodo._rutaOriginal;
        return true;
    }

    vaciarPapelera() {
        for (const n of [...this.papelera.children]) {
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

    renombrar(ruta, nuevoNombre) {
        const nodo = this.buscarPorRuta(ruta);
        if (!nodo || nodo === this.root || nodo === this.papelera) return false;

        const viejoNombre = nodo.nombre;
        nodo.nombre = nuevoNombre;
        this._actualizarNombreIndices(nodo, viejoNombre, nuevoNombre);
        return true;
    }

    mover(rutaOrigen, rutaDestino) {
        const nodo = this.buscarPorRuta(rutaOrigen);
        const destino = this.buscarPorRuta(rutaDestino);

        if (!nodo || !destino) return false;
        if (nodo === this.root) return false;

        nodo.parent.children = nodo.parent.children.filter(h => h !== nodo);
        
        nodo.parent = destino;
        destino.children.push(nodo);

        return true;
    }

    tamaño(nodo = this.root) {
        let total = 1;
        for (const h of nodo.children)
            total += this.tamaño(h);
        return total;
    }

    altura(nodo = this.root) {
        if (nodo.children.length === 0) return 0;
        return 1 + Math.max(...nodo.children.map(h => this.altura(h)));
    }

    guardarJSON(rutaArchivo) {
        const data = {
            proyecto: "mini-suite-arboles",
            ultima_id: this.lastId,
            root: this._nodoToJSON(this.root)
        };

        fs.writeFileSync(rutaArchivo, JSON.stringify(data, null, 2));
    }

    _nodoToJSON(nodo) {
        return {
            id: nodo.id,
            nombre: nodo.nombre,
            tipo: nodo.tipo,
            contenido: nodo.contenido,
            children: nodo.children.map(hijo => this._nodoToJSON(hijo))
        };
    }

    cargarJSON(rutaArchivo) {
        const data = JSON.parse(fs.readFileSync(rutaArchivo));

        this.lastId = data.ultima_id;
        this.hash = new Map();
        this.trie = new Trie();

        this.root = this._jsonToNodo(data.root, null);
    }

    _jsonToNodo(obj, parent) {
        const nodo = new Node(obj.id, obj.nombre, obj.tipo, obj.contenido, parent);

        this._agregarAIndices(nodo);
        nodo.children = obj.children.map(h => this._jsonToNodo(h, nodo));
        return nodo;
    }
}

module.exports = Arbol;
