using System;

class QuickSortPrograma
{
    static void Main()
    {
        int[] arreglo = { 64, 34, 25, 12, 22, 11, 90 };

        Console.WriteLine("Arreglo desordenado:");
        Imprimir(arreglo);

        QuickSort(arreglo, 0, arreglo.Length - 1);

        Console.WriteLine("Arreglo ordenado:");
        Imprimir(arreglo);
    }

    static void QuickSort(int[] arr, int inicio, int fin)
    {
        if (inicio < fin)
        {
            int p = Particion(arr, inicio, fin);
            QuickSort(arr, inicio, p - 1);
            QuickSort(arr, p + 1, fin);
        }
    }

    static int Particion(int[] arr, int inicio, int fin)
    {
        int pivote = arr[fin];
        int i = inicio - 1;

        for (int j = inicio; j < fin; j++)
            if (arr[j] < pivote)
            {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }

        int temp2 = arr[i + 1];
        arr[i + 1] = arr[fin];
        arr[fin] = temp2;

        return i + 1;
    }

    static void Imprimir(int[] arr)
    {
        foreach (int n in arr)
            Console.Write(n + " ");
        Console.WriteLine();
    }
}
