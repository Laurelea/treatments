
export interface IComponent {
    id?: number,
    component_name: string,
    substances: number[],
    description: string
}

export interface ISubstance {
    id: number,
    substance_name: string,
}

export interface IDictionary<T> {
    [key: string]: T;
}
