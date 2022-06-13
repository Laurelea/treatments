export interface IDictionary<T> {
    [key: string]: T;
}

export interface IComponent {
    id: number,
    name: string,
    substance: string,
}

export interface ITemplate {
    id: number,
    plant: string,
    purpose: string,
    contents: Array<string>,
    phase_start: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number | null,
    special_condition: string | null,
    apply_type: string,
    type: string,
    dosage: string,
    volume: string,
}

export interface IProduct {
    id: number,
    product_name: string,
    yeartype: number,
    rootstock: boolean,
    soil: string,
    watering : string,
    depth_min: number,
    depth_max: number,
    sun: string,
    category: number,
}
