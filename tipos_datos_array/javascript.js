// Definir tipo personalizado
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
  }
}

// Declarar un array del tipo personalizado
const personas = [
  new Persona("Fer", 22),
  new Persona("Omar", 23)
];

console.log(personas[0].nombre); 
