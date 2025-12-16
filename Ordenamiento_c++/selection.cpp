void selectionSort(int a[], int n) {
    for(int i = 0; i < n - 1; i++) {
        int min = i;
        for(int j = i + 1; j < n; j++) {
            if(a[j] < a[min])
                min = j;
        }
        int aux = a[i];
        a[i] = a[min];
        a[min] = aux;
    }
}