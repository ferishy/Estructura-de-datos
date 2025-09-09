let numeros = [];
numeros.push(10);
numeros.push(20);
numeros.push(30);

let buscado = 20;
let index = numeros.indexOf(buscado);
if (index !== -1) {
  console.log("Encontrado en índice " + index);
}
