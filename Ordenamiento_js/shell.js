let arreglo = [64, 34, 25, 12, 22, 11, 90];

console.log("Arreglo desordenado:");
console.log(arreglo);

function shellSort(arr) {
    for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < arr.length; i++) {
            let temp = arr[i];
            let j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}

shellSort(arreglo);

console.log("Arreglo ordenado:");
console.log(arreglo);
