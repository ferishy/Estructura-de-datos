using System;

class HeapSortPrograma
{
    static void Main()
    {
        int[] arreglo = { 64, 34, 25, 12, 22, 11, 90 };

        Console.WriteLine("Arreglo desordenado:");
        Imprimir(arreglo);

        HeapSort(arreglo);

        Console.WriteLine("Arreglo ordenado:");
        Imprimir(arreglo);
    }

    static void HeapSort(int[] arr)
    {
        int n = arr.Length;

        for (int i = n / 2 - 1; i >= 0; i--)
            Heapify(arr, n, i);

        for (int i = n - 1; i > 0; i--)
        {
            int temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            Heapify(arr, i, 0);
        }
    }

    static void Heapify(int[] arr, int n, int i)
    {
        int mayor = i;
        int izq = 2 * i + 1;
        int der = 2 * i + 2;

        if (izq < n && arr[izq] > arr[mayor])
            mayor = izq;

        if (der < n && arr[der] > arr[mayor])
            mayor = der;

        if (mayor != i)
        {
            int temp = arr[i];
            arr[i] = arr[mayor];
            arr[mayor] = temp;

            Heapify(arr, n, mayor);
        }
    }

    static void Imprimir(int[] arr)
    {
        foreach (int n in arr)
            Console.Write(n + " ");
        Console.WriteLine();
    }
}
