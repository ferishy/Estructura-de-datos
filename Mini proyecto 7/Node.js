class Node {
    constructor(id, nombre, tipo, contenido = "", parent = null) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo; // "carpeta" o "archivo"
        this.contenido = contenido;
        this.children = [];
        this.parent = parent;
    }
}
module.exports = Node;