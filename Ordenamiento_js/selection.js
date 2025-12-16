let arreglo = [64, 34, 25, 12, 22, 11, 90];

console.log("Arreglo desordenado:");
console.log(arreglo);

function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        let temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
    }
}

selectionSort(arreglo);

console.log("Arreglo ordenado:");
console.log(arreglo);
