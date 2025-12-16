using System;

class MergeSortPrograma
{
    static void Main()
    {
        int[] arreglo = { 64, 34, 25, 12, 22, 11, 90 };

        Console.WriteLine("Arreglo desordenado:");
        Imprimir(arreglo);

        MergeSort(arreglo, 0, arreglo.Length - 1);

        Console.WriteLine("Arreglo ordenado:");
        Imprimir(arreglo);
    }

    static void MergeSort(int[] arr, int inicio, int fin)
    {
        if (inicio < fin)
        {
            int medio = (inicio + fin) / 2;
            MergeSort(arr, inicio, medio);
            MergeSort(arr, medio + 1, fin);
            Mezclar(arr, inicio, medio, fin);
        }
    }

    static void Mezclar(int[] arr, int inicio, int medio, int fin)
    {
        int n1 = medio - inicio + 1;
        int n2 = fin - medio;

        int[] L = new int[n1];
        int[] R = new int[n2];

        Array.Copy(arr, inicio, L, 0, n1);
        Array.Copy(arr, medio + 1, R, 0, n2);

        int i = 0, j = 0, k = inicio;

        while (i < n1 && j < n2)
            arr[k++] = (L[i] <= R[j]) ? L[i++] : R[j++];

        while (i < n1)
            arr[k++] = L[i++];

        while (j < n2)
            arr[k++] = R[j++];
    }

    static void Imprimir(int[] arr)
    {
        foreach (int n in arr)
            Console.Write(n + " ");
        Console.WriteLine();
    }
}
