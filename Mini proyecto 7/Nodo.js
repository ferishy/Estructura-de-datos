class Nodo {
    constructor(id, nombre, tipo, contenido = null) {
        this.id = id;                  // número identificador
        this.nombre = nombre;          // nombre del nodo
        this.tipo = tipo;              // "carpeta" | "archivo"
        this.contenido = contenido;    // contenido si es archivo
        this.hijos = [];               // lista de hijos
        this.padre = null;             // referencia al padre
    }
}

module.exports = Nodo;
