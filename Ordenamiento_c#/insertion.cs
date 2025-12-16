using System;

class InsertionSortPrograma
{
    static void Main()
    {
        int[] arreglo = { 64, 34, 25, 12, 22, 11, 90 };

        Console.WriteLine("Arreglo desordenado:");
        Imprimir(arreglo);

        InsertionSort(arreglo);

        Console.WriteLine("Arreglo ordenado:");
        Imprimir(arreglo);
    }

    static void InsertionSort(int[] arr)
    {
        for (int i = 1; i < arr.Length; i++)
        {
            int key = arr[i];
            int j = i - 1;

            while (j >= 0 && arr[j] > key)
            {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    static void Imprimir(int[] arr)
    {
        foreach (int n in arr)
            Console.Write(n + " ");
        Console.WriteLine();
    }
}
