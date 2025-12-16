void merge(int a[], int l, int m, int r) {
    int i = l, j = m + 1;
    int aux[100];
    int k = l;

    while(i <= m && j <= r) {
        if(a[i] <= a[j])
            aux[k++] = a[i++];
        else
            aux[k++] = a[j++];
    }

    while(i <= m)
        aux[k++] = a[i++];
    while(j <= r)
        aux[k++] = a[j++];

    for(int i = l; i <= r; i++)
        a[i] = aux[i];
}

void mergeSort(int a[], int l, int r) {
    if(l < r) {
        int m = (l + r) / 2;
        mergeSort(a, l, m);
        mergeSort(a, m + 1, r);
        merge(a, l, m, r);
    }
}