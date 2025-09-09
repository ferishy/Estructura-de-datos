using System;

class Program
{
    static void Main()
    {
        int[] numeros = new int[5];
        numeros[0] = 10;
        numeros[1] = 20;
        numeros[2] = 30;

        int buscado = 20;
        for (int i = 0; i < numeros.Length; i++)
        {
            if (numeros[i] == buscado)
            {
                Console.WriteLine("Encontrado en índice " + i);
                break;
            }
        }
    }
}
