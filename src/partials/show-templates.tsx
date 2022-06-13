import '../App.css';
import React, { useState, useEffect, FormEvent } from 'react'
import { sortBy } from "src/utils/funcs";
import api from '../utils/api'
import { IComponent } from '../utils/types'


interface ITemplate {
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

interface IProduct {
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


interface IShowTemplates {
    templates: Array<ITemplate> | undefined,
    showAddTemplate: boolean,
    products: Array<IProduct> | undefined,
    selectedPlant: number | undefined,
    types: Array<{ id: number, name: string }> | undefined,
    applyTypes: Array<{ id: number, name: string }> | undefined,
    purposeName: string,
    selectedType: number | undefined,
    selectedApplyType: number | undefined,
    components: Array<IComponent> | undefined,
    selectedContents: Array<number> | undefined,
    phases: Array<{ id: number, name: string }>  | undefined,
    selectedPhaseStart: number | undefined,
    selectedPhaseEnd: number | undefined,
    freq: number,
    gap: number,
    specCond: string,
    dosage: string,
    volume: string,
}

const ShowTemplates = () => {
    const [state, setState] =  useState<IShowTemplates>({
        templates: undefined,
        showAddTemplate: false,
        products: undefined,
        selectedPlant: undefined,
        types: undefined,
        applyTypes: undefined,
        purposeName: '',
        selectedType: undefined,
        selectedApplyType: undefined,
        components: undefined,
        selectedContents: undefined,
        phases: undefined,
        selectedPhaseStart: undefined,
        selectedPhaseEnd: undefined,
        freq: 0,
        gap: 0,
        specCond: '',
        dosage: '',
        volume: '',
    })
    const showAddTemplate = () => {
        setState({
            ...state,
            showAddTemplate: !state.showAddTemplate
        })
    }

    const getInitialData = async () => {
        const templates = await api('get', 'show-templates');
        const types = await api('get', 'get-treatment-types');
        const applyTypes = await api('get', 'get-treatment-apply-types');
        const products = await api('get', 'get-products');
        const components = await api('get', 'show-components');
        const phases = await api('get', 'get-phases');
        setState({
            ...state,
            templates,
            products,
            types,
            applyTypes,
            components,
            phases
        })
    }
    const addTemplate = async (event: FormEvent) => {
        event.preventDefault();
        if (!state.selectedPlant || !state.selectedType || !state.selectedApplyType || !state.selectedContents ||
        !state.selectedPhaseEnd || !state.selectedPhaseStart || (state.freq > 0 && !state.gap)) {
            window.alert('неверно заполнены поля')
            return
        } else {
            const data = {
                plant: state.selectedPlant,
                purpose: state.purposeName,
                contents: state.selectedContents,
                phase_start: state.selectedPhaseStart,
                phase_end: state.selectedPhaseEnd,
                frequency: state.freq,
                treatment_gap: state.gap,
                special_condition: state.specCond,
                apply_type: state.selectedApplyType,
                type: state.selectedType,
                dosage: state.dosage,
                volume: state.volume,
            }
            await api('post', 'add-template', data)
                .then(async res => {
                    const { success, message } = await res
                    if (success) {
                        const templates = await api('get', 'show-templates');
                        setState({
                            ...state,
                            templates,
                            selectedPlant: undefined,
                            purposeName: '',
                            selectedType: undefined,
                            selectedApplyType: undefined,
                            selectedContents: undefined,
                            selectedPhaseStart: undefined,
                            selectedPhaseEnd: undefined,
                            freq: 0,
                            gap: 0,
                            specCond: '',
                            dosage: '',
                            volume: '',
                        })
                    }
                    window.alert(JSON.stringify(message))
                })
                .catch(error => {
                    console.info(error);
                })
        }
    }
    const handleSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info('select', e.target.name)
        setState({
            ...state,
            [e.target.name]: Number(e.target.value) })
    }
    const handleSelectContents = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info('select contents', e.target.selectedOptions)
        setState({
            ...state,
            selectedContents: Array.from(e.target.selectedOptions, option => Number(option.value))
        })
    }
    const handleFreq = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            freq: Number(e.target.value) })
    }
    const handleGap = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            gap: Number(e.target.value) })
    }
    const handleStringValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
        [e.target.name]: e.target.value })
    }

    useEffect(() => {
        getInitialData()
    }, [])
    return (
        <div className='container main-container'>
            <div className='container controller-container'>
                <div className='container buttons-container'>
                    <button onClick={showAddTemplate} className='add-button'>Добавить шаблон обработки</button>
                </div>
                <div className='container controller-contents-container'>
                    {state.showAddTemplate ?
                    <form name='Форма для добавления нового компонента' id='CompAddForm' className='add-component-form'  onSubmit={addTemplate}
                          autoComplete="on">
                        <h3 className='whole-line'>
                            Добавить новый шаблон обработки
                        </h3>
                        <label className='whole-line'>Растение</label>
                        <select
                            name="selectedPlant"
                            required
                            className='select-add'
                            onChange={handleSelect}
                            value={state.selectedPlant}>
                            <option> </option>
                            {state.products
                                ? sortBy(state.products, 'product_name')
                                    .map(item => (
                                        <option key={item.id} value={item.id}>{item.product_name}</option>
                                    ))
                                : 'no substances in state'
                            }
                        </select>
                        <label className='whole-line'>Тип обработки по цели</label>
                        <select
                            name="selectedType"
                            required
                            className='select-add'
                            onChange={handleSelect}
                            value={state.selectedType}>
                            <option> </option>
                            {state.types
                                ? sortBy(state.types, 'name')
                                    .map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                : 'no types in state'
                            }
                        </select>
                        <label className='whole-line'>Цель</label>
                        <input
                            type='text'
                            placeholder='Цель обработки'
                            name='purposeName'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handleStringValue}
                            value={state.purposeName}/>
                        <label className='whole-line'>Тип обработки по способу</label>
                        <select
                            name="selectedApplyType"
                            required
                            className='select-add'
                            onChange={handleSelect}
                            value={state.selectedApplyType}>
                            <option> </option>
                            {state.applyTypes
                                ? sortBy(state.applyTypes, 'name')
                                    .map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                : 'no substances in state'
                            }
                        </select>
                        <label className='whole-line'>Состав</label>
                        <select
                            name="selectedContents"
                            required
                            className='select-add'
                            onChange={handleSelectContents}
                            value={state.selectedContents ? state.selectedContents.map(cont => String(cont)) : ''}
                            multiple={true}>
                            <option> </option>
                            {state.components
                                ? sortBy(state.components, 'name')
                                    .map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                : 'no components in state'
                            }
                        </select>
                        <label className='whole-line'>Фаза начала обработки</label>
                        <select
                            name="selectedPhaseStart"
                            required
                            className='select-add'
                            onChange={handleSelect}
                            value={state.selectedPhaseStart}>
                            <option> </option>
                            {state.phases
                                ? sortBy(state.phases, 'name')
                                    .map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                : 'no phases in state'
                            }
                        </select>
                        <label className='whole-line'>Фаза конца обработки</label>
                        <select
                            name="selectedPhaseEnd"
                            required
                            className='select-add'
                            onChange={handleSelect}
                            value={state.selectedPhaseEnd}>
                            <option> </option>
                            {state.phases
                                ? sortBy(state.phases, 'name')
                                    .map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                : 'no phases in state'
                            }
                        </select>
                        <label className='whole-line'>Кратность</label>
                        <input
                            type='text'
                            placeholder='Кратность обработки'
                            name='frequency'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handleFreq}
                            value={state.freq}/>
                        <label className='whole-line'>Промежуток между обработками</label>
                        <input
                            type='text'
                            placeholder='Промежуток'
                            name='gap'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handleGap}
                            value={state.gap}/>
                        <label className='whole-line'>Дозировка</label>
                        <input
                            type='text'
                            placeholder=''
                            name='dosage'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handleStringValue}
                            value={state.dosage}/>
                        <label className='whole-line'>Расход</label>
                        <input
                            type='text'
                            placeholder=''
                            name='volume'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handleStringValue}
                            value={state.volume}/>
                        <label className='whole-line'>Специальные условия</label>
                        <input
                            type='text'
                            placeholder=''
                            name='specCond'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handleStringValue}
                            value={state.specCond}/>
                        <button  type='submit' className='add-button'>Добавить</button>
                        <button onClick={showAddTemplate} className='add-button'>Отмена</button>
                    </form> : null }
                </div>
            </div>
            <div className='container table-container'>

            {state.templates ?
                state.templates.map((c: ITemplate) => (
                        <div className='component' key={c.id}>
                            <div><p>'ID:'</p>{c.id}</div>
                            <div><p>'Plant:'</p>{c.plant}</div>
                            <div><p>'Contents:'</p>{c.contents.join(', ')}</div>
                            <div><p>'Phase begin:'</p>{c.phase_start}</div>
                            <div><p>'Phase end:'</p>{c.phase_end}</div>
                        </div>
                    ),
                ) : 'no templates found'}
                </div>
        </div>

    )
}

export default ShowTemplates
