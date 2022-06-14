import '../App.css';
import React, { useState, useEffect, FormEvent } from 'react'
import { sortBy } from "src/utils/funcs";
import api from "src/utils/api";
import { ITemplate, IProduct, IComponent } from '../utils/types'


interface ITreatment {
    id: number,
    date_start: string,
    status: string,
    period_started: boolean,
    period_ended: boolean,
    dates_to_do: Array<string> | undefined,
    dates_done: Array<string> | undefined,
    number_done: number,
    date_create: string,
    plant: string,
    type: string,
    purpose: string,
    contents: Array<number>,
    phase_start: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number | null,
    special_condition: string,
}

interface IShowTreatments {
    treatments: Array<ITreatment> | undefined,
    showAddTreatment: boolean,
    templates: Array<ITemplate> | undefined,
    products: Array<IProduct> | undefined,
    selectedPlant: string | undefined,
    selectedTemplate: number | undefined,
    selectedType: string | undefined,
    types: Array<{ id: number, name: string }> | undefined,
    phases: Array<{ id: number, name: string }> | undefined,
    selectedPhaseStart: string | undefined,
    showChangeContents: boolean,
    components: Array<IComponent> | undefined,
}

export const ShowTreatments =  () => {
    console.info('ShowTreatments')
    const [state, setState] =  useState<IShowTreatments>({
        treatments: undefined,
        showAddTreatment: false,
        templates: undefined,
        products: undefined,
        selectedPlant: undefined,
        selectedTemplate: undefined,
        selectedType: undefined,
        types: undefined,
        phases: undefined,
        selectedPhaseStart: undefined,
        showChangeContents: false,
        components: undefined,
    })
    const [template, setTemplate] = useState<{ selectedTemplate: ITemplate | undefined }>({
        selectedTemplate: undefined
    })
    const showAddTreatment = () => {
        setState({
            ...state,
            showAddTreatment: !state.showAddTreatment
        })
    }
    const addTreatment = (event: FormEvent) => {
        return
    }
    const handleStringSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info('select', e.target.name)
        setState({
            ...state,
            [e.target.name]: e.target.value })
    }
    const handleTemplateSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
        setState({
            ...state,
            selectedTemplate: Number(e.target.value)
        })
        setTemplate({
            ...template,
            selectedTemplate: state.templates!.filter(t => t.id == Number(e.target.value))[0]
        })
    }
    // const handleNumberSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     console.info('select', e.target.name)
    //     setState({
    //         ...state,
    //         [e.target.name]: Number(e.target.value) })
    // }
    const dropTemplate = () => {
        setState({
            ...state,
            selectedTemplate: undefined
        })
        setTemplate({
            ...template,
            selectedTemplate: undefined
        })
    }
    const showChangeContents = () => {
        return
    }
    const getInitialData = async () => {
        const treatments = await api('get', 'show-treatments');
        const templates = await api('get', 'show-templates');
        const products = await api('get', 'get-products');
        const types = await api('get', 'get-treatment-types');
        const phases = await api('get', 'get-phases');
        const components = await api('get', 'show-components');
        setState({
            ...state,
            treatments,
            templates,
            products,
            types,
            phases,
            components
        })
    }
    useEffect(() => {
        getInitialData()
    }, [])
    return (
        <div className='container main-container'>
            <div className='container controller-container'>
                <div className='container buttons-container'>
                    <button onClick={showAddTreatment} className='add-button'>Добавить обработку</button>
                </div>
                <div className='container controller-contents-container'>
                    {state.showAddTreatment ?
                        <form name='Форма для добавления новой обработки' id='TreatAddForm' className='add-treatment-form' onSubmit={addTreatment}
                              autoComplete="on">
                            <h3 className='whole-line'>
                                Добавить новую обработку
                            </h3>
                            {template.selectedTemplate ?
                                <div className='template'>
                                    <h4 className='whole-line'>
                                        Выбранный шаблон
                                    </h4>
                                    <div><p>'ID:'</p>{template.selectedTemplate.id}</div>
                                    <div><p>'Plant:'</p>{template.selectedTemplate.plant}</div>
                                    <div><p>'Contents:'</p>{template.selectedTemplate.contents.join(', ')}</div>
                                    <button onClick={dropTemplate} className='add-button'>Выбрать другой шаблон</button>
                                    <button onClick={showChangeContents} className='add-button'>Изменить состав</button>
                                    {state.showChangeContents ?
                                        <div></div>
                                    : null}
                                </div>
                                :
                                <>
                                    <h4 className='whole-line'>
                                        Выберите шаблон
                                    </h4>
                                    <label className='whole-line'>Растение</label>
                                    <select
                                    name="selectedPlant"
                                    required
                                    className='select-add'
                                    onChange={handleStringSelect}
                                    value={state.selectedPlant}>
                                    <option> </option>
                                {state.products
                                    ? sortBy(state.products, 'product_name')
                                    .map(item => (
                                    <option key={item.id} value={item.product_name}>{item.product_name}</option>
                                    ))
                                    : 'no products in state'
                                }
                                    </select>
                                    <label className='whole-line'>Тип обработки по цели</label>
                                    <select
                                    name="selectedType"
                                    required
                                    className='select-add'
                                    onChange={handleStringSelect}
                                    value={state.selectedType}>
                                    <option> </option>
                                {state.types
                                    ? sortBy(state.types, 'name')
                                    .map(item => (
                                    <option key={item.id} value={item.name}>{item.name}</option>
                                    ))
                                    : 'no types in state'
                                }
                                    </select>
                                    <label className='whole-line'>Фаза начала обработки</label>
                                    <select
                                        name="selectedPhaseStart"
                                        required
                                        className='select-add'
                                        onChange={handleStringSelect}
                                        value={state.selectedPhaseStart}>
                                        <option> </option>
                                        {state.phases
                                            ? sortBy(state.phases, 'name')
                                                .map(item => (
                                                    <option key={item.id} value={item.name}>{item.name}</option>
                                                ))
                                            : <option>{'no phases in state'}</option>
                                        }
                                    </select>
                                    <label className='whole-line'>Шаблон</label>
                                    <select
                                        name="selectedTemplate"
                                        required
                                        className='select-add'
                                        onChange={handleTemplateSelect}
                                        value={state.selectedTemplate}>
                                        <option> </option>
                                        {state.templates
                                            ? state.templates
                                                .filter(c => state.selectedPlant ? c.plant == state.selectedPlant : c.plant)
                                                .filter(c => state.selectedType ? c.type == state.selectedType : c.type)
                                                .filter(c => state.selectedPhaseStart ? c.phase_start == state.selectedPhaseStart : c.phase_start)
                                                .map(item => (
                                                    <option key={item.id} value={item.id}>{item.plant}-{item.type}-{item.phase_start}-{item.purpose}</option>
                                                ))
                                            : <option>{'no templates found'}</option>
                                        }
                                    </select>
                                </>
                            }
                            <button  type='submit' className='add-button'>Добавить</button>
                            <button onClick={showAddTreatment} className='add-button'>Отмена</button>
                        </form>
                        : null }
                </div>
            </div>
            <div className='container table-container'>
                {state.treatments && state.components ?
                    state.treatments
                        .map((c: ITreatment) => (
                            <div className='component' key={c.id}>
                                <div><p>'ID:'</p>{c.id}</div>
                                <div><p>'Plant:'</p>{c.plant}</div>
                                <div><p>'Contents:'</p>{c.contents.map((c: number) => state.components!.filter((cm: IComponent) => cm.id == c)[0].name).join(', ')}</div>
                            </div>
                        ),
                    ) : 'no treatments found'}
            </div>
        </div>
    )
}

