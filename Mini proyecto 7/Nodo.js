class Node {
    constructor(id, nombre, tipo, contenido = "", parent = null) {
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo; 
        this.contenido = contenido;
        this.children = [];
        this.parent = parent;
    }
}

module.exports = Node;