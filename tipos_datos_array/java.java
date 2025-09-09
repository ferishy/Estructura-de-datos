class Persona {
    String nombre;
    int edad;

    Persona(String nombre, int edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
}

public class java {
    public static void main(String[] args) {
        // Declarar un array del tipo personalizado
        Persona[] personas = new Persona[2];
        personas[0] = new Persona("Fer", 22);
        personas[1] = new Persona("Omar", 23);

        System.out.println(personas[0].nombre); 
    }
}
