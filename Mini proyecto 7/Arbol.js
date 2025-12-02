const Nodo = require("./Nodo");
const fs = require("fs");

class Arbol {
    constructor() {
        this.raiz = new Nodo(0, "root", "carpeta");
        this.siguienteId = 1;

        // mapa para búsqueda exacta
        this.mapaNombres = new Map();

        this.indexarNodo(this.raiz);
    }

    // -------------------- UTILIDADES --------------------

    indexarNodo(nodo) {
        if (!this.mapaNombres.has(nodo.nombre)) {
            this.mapaNombres.set(nodo.nombre, []);
        }
        this.mapaNombres.get(nodo.nombre).push(nodo);

        nodo.hijos.forEach(h => this.indexarNodo(h));
    }

    limpiarMapa() {
        this.mapaNombres = new Map();
    }

    buscarPorRuta(ruta) {
        if (ruta === "/" || ruta === "") return this.raiz;

        const partes = ruta.split("/").filter(Boolean);

        let actual = this.raiz;

        for (const p of partes) {
            const hijo = actual.hijos.find(c => c.nombre === p);
            if (!hijo) return null;
            actual = hijo;
        }

        return actual;
    }

    // -------------------- OPERACIONES MVP --------------------

    insertar(rutaPadre, nombre, tipo, contenido = "") {
        const padre = this.buscarPorRuta(rutaPadre);
        if (!padre || padre.tipo !== "carpeta") return false;

        // evitar duplicados
        if (padre.hijos.some(c => c.nombre === nombre)) return false;

        const nodo = new Nodo(this.siguienteId++, nombre, tipo, contenido);
        nodo.padre = padre;
        padre.hijos.push(nodo);

        if (!this.mapaNombres.has(nombre)) {
            this.mapaNombres.set(nombre, []);
        }
        this.mapaNombres.get(nombre).push(nodo);

        return true;
    }

    listarHijos(ruta) {
        const nodo = this.buscarPorRuta(ruta);
        return nodo ? nodo.hijos : [];
    }

    rutaCompleta(nodo) {
        const partes = [];
        let actual = nodo;

        while (actual && actual.id !== 0) {
            partes.push(actual.nombre);
            actual = actual.padre;
        }

        return "/" + partes.reverse().join("/");
    }

    exportarPreorden(nodo = this.raiz, nivel = 0) {
        const prefijo = "  ".repeat(nivel);
        console.log(
            `${prefijo}${nodo.tipo === "carpeta" ? "[Carpeta]" : "[Archivo]"} ${nodo.nombre}`
        );

        nodo.hijos.forEach(h => this.exportarPreorden(h, nivel + 1));
    }

    // -------------------- JSON --------------------

    guardarJSON(rutaArchivo) {
        const objeto = { raiz: this.nodoAObjeto(this.raiz) };
        fs.writeFileSync(rutaArchivo, JSON.stringify(objeto, null, 2));
        return true;
    }

    nodoAObjeto(n) {
        return {
            id: n.id,
            nombre: n.nombre,
            tipo: n.tipo,
            contenido: n.contenido,
            hijos: n.hijos.map(h => this.nodoAObjeto(h))
        };
    }

    cargarJSON(rutaArchivo) {
        const datos = fs.readFileSync(rutaArchivo, "utf8");
        const obj = JSON.parse(datos);

        this.raiz = this.objetoANodo(obj.raiz);
        this.limpiarMapa();
        this.indexarNodo(this.raiz);

        // actualizar siguienteId
        let max = 0;
        for (const lista of this.mapaNombres.values()) {
            for (const nodo of lista) {
                max = Math.max(max, nodo.id);
            }
        }
        this.siguienteId = max + 1;

        return true;
    }

    objetoANodo(o, padre = null) {
        const nodo = new Nodo(o.id, o.nombre, o.tipo, o.contenido);
        nodo.padre = padre;

        o.hijos.forEach(h => {
            const hijo = this.objetoANodo(h, nodo);
            nodo.hijos.push(hijo);
        });

        return nodo;
    }
}

module.exports = Arbol;
