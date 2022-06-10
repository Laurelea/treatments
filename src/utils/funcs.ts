export const sortBy = (arr: any[], x: string) => arr.sort((a: any, b: any) => {
    if (a[x] > b[x]) return 1;
    if (a[x] < b[x]) return -1;
    return 0;
});
