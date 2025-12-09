class TrieNode {
    constructor() {
        this.children = new Map();
        this.finDePalabra = false;
        this.nodos = []; 
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insertar(palabra, nodo) {
        let actual = this.root;

        for (const c of palabra) {
            if (!actual.children.has(c)) {
                actual.children.set(c, new TrieNode());
            }
            actual = actual.children.get(c);
        }

        actual.finDePalabra = true;
        actual.nodos.push(nodo);
    }

    eliminar(palabra, nodo) {
        const eliminarRec = (node, palabra, i) => {
            if (i === palabra.length) {
                node.nodos = node.nodos.filter(n => n !== nodo);
                if (node.nodos.length === 0) node.finDePalabra = false;
                return node.children.size === 0 && !node.finDePalabra;
            }

            const c = palabra[i];
            if (!node.children.has(c)) return false;

            const eliminarHijo = eliminarRec(node.children.get(c), palabra, i + 1);

            if (eliminarHijo) {
                node.children.delete(c);
                return node.children.size === 0 && !node.finDePalabra;
            }

            return false;
        };

        eliminarRec(this.root, palabra, 0);
    }

    buscarExacto(palabra) {
        let actual = this.root;

        for (const c of palabra) {
            if (!actual.children.has(c)) return [];
            actual = actual.children.get(c);
        }

        return actual.finDePalabra ? actual.nodos : [];
    }

    autocompletar(prefijo) {
        let actual = this.root;

        for (const c of prefijo) {
            if (!actual.children.has(c)) return [];
            actual = actual.children.get(c);
        }

        const resultados = [];

        const dfs = (nodo) => {
            if (nodo.finDePalabra)
                resultados.push(...nodo.nodos);

            for (const hijo of nodo.children.values()) {
                dfs(hijo);
            }
        };

        dfs(actual);
        return resultados;
    }
}

module.exports = Trie;