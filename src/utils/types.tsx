
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

export interface ITemplate {
    id?: number,
    template_name: string,
    plant_id?: number,
    plant_name?: string,
    contents: number[],
    phase_start: string,
    phase_end: string,
    frequency: number | null,
    treatment_gap: number | null,
    special_condition: string,
    apply_type: string,
    type: string,
    dosage: string,
    volume: string,
}
