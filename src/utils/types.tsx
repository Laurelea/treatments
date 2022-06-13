export interface IDictionary<T> {
    [key: string]: T;
}

export interface IComponent {
    id: number,
    name: string,
    substance: string,
}
