public struct Persona
{
    public string Nombre;
    public int Edad;

    public Persona(string nombre, int edad)
    {
        Nombre = nombre;
        Edad = edad;
    }
}

class Program
{
    static void Main()
    {
        // Declarar un array del tipo personalizado
        Persona[] personas = new Persona[2];
        personas[0] = new Persona("Fer", 22);
        personas[1] = new Persona("Omar", 23);

        Console.WriteLine(personas[0].Nombre);
    }
}
