let arreglo = [64, 34, 25, 12, 22, 11, 90];

console.log("Arreglo desordenado:");
console.log(arreglo);

function quickSort(arr) {
    if (arr.length <= 1) return arr;

    let pivote = arr[arr.length - 1];
    let menores = [];
    let mayores = [];

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivote)
            menores.push(arr[i]);
        else
            mayores.push(arr[i]);
    }

    return quickSort(menores).concat(pivote, quickSort(mayores));
}

let arregloOrdenado = quickSort(arreglo);

console.log("Arreglo ordenado:");
console.log(arregloOrdenado);
