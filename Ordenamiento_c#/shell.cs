using System;

class ShellSortPrograma
{
    static void Main()
    {
        int[] arreglo = { 64, 34, 25, 12, 22, 11, 90 };

        Console.WriteLine("Arreglo desordenado:");
        Imprimir(arreglo);

        ShellSort(arreglo);

        Console.WriteLine("Arreglo ordenado:");
        Imprimir(arreglo);
    }

    static void ShellSort(int[] arr)
    {
        for (int gap = arr.Length / 2; gap > 0; gap /= 2)
        {
            for (int i = gap; i < arr.Length; i++)
            {
                int temp = arr[i];
                int j;

                for (j = i; j >= gap && arr[j - gap] > temp; j -= gap)
                    arr[j] = arr[j - gap];

                arr[j] = temp;
            }
        }
    }

    static void Imprimir(int[] arr)
    {
        foreach (int n in arr)
            Console.Write(n + " ");
        Console.WriteLine();
    }
}
