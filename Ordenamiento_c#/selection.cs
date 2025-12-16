using System;

class SelectionSortPrograma
{
    static void Main()
    {
        int[] arreglo = { 64, 34, 25, 12, 22, 11, 90 };

        Console.WriteLine("Arreglo desordenado:");
        Imprimir(arreglo);

        SelectionSort(arreglo);

        Console.WriteLine("Arreglo ordenado:");
        Imprimir(arreglo);
    }

    static void SelectionSort(int[] arr)
    {
        for (int i = 0; i < arr.Length - 1; i++)
        {
            int min = i;
            for (int j = i + 1; j < arr.Length; j++)
                if (arr[j] < arr[min])
                    min = j;

            int temp = arr[i];
            arr[i] = arr[min];
            arr[min] = temp;
        }
    }

    static void Imprimir(int[] arr)
    {
        foreach (int n in arr)
            Console.Write(n + " ");
        Console.WriteLine();
    }
}
