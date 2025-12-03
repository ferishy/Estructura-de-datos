class Arbol {
    constructor() {
        this.root = new Node(0, "/", "carpeta");
        this.lastId = 0;
    }

    generarId() {
        this.lastId++;
        return this.lastId;
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
}
