import '../App.css';
import React, { useState, useEffect, FormEvent } from 'react'
import { sortBy } from "src/utils/funcs";
import api from "src/utils/api";
import { ITemplate, IProduct } from '../utils/types'


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
    components: Array<string>
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
    const handleNumberSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info('select', e.target.name)
        setState({
            ...state,
            [e.target.name]: Number(e.target.value) })
    }
    const getInitialData = async () => {
        const treatments = await api('get', 'show-treatments');
        const templates = await api('get', 'show-templates');
        const products = await api('get', 'get-products');
               setState({
            ...state,
            treatments,
            templates,
            products
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
                            {/*<label className='whole-line'>Тип обработки по цели</label>*/}
                            {/*<select*/}
                            {/*    name="selectedType"*/}
                            {/*    required*/}
                            {/*    className='select-add'*/}
                            {/*    onChange={handleSelect}*/}
                            {/*    value={state.selectedType}>*/}
                            {/*    <option> </option>*/}
                            {/*    {state.types*/}
                            {/*        ? sortBy(state.types, 'name')*/}
                            {/*            .map(item => (*/}
                            {/*                <option key={item.id} value={item.id}>{item.name}</option>*/}
                            {/*            ))*/}
                            {/*        : 'no types in state'*/}
                            {/*    }*/}
                            {/*</select>*/}
                            {/*<label className='whole-line'>Цель</label>*/}
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder='Цель обработки'*/}
                            {/*    name='purposeName'*/}
                            {/*    required*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    onChange={handleStringValue}*/}
                            {/*    value={state.purposeName}/>*/}
                            {/*<label className='whole-line'>Тип обработки по способу</label>*/}
                            {/*<select*/}
                            {/*    name="selectedApplyType"*/}
                            {/*    required*/}
                            {/*    className='select-add'*/}
                            {/*    onChange={handleSelect}*/}
                            {/*    value={state.selectedApplyType}>*/}
                            {/*    <option> </option>*/}
                            {/*    {state.applyTypes*/}
                            {/*        ? sortBy(state.applyTypes, 'name')*/}
                            {/*            .map(item => (*/}
                            {/*                <option key={item.id} value={item.id}>{item.name}</option>*/}
                            {/*            ))*/}
                            {/*        : 'no substances in state'*/}
                            {/*    }*/}
                            {/*</select>*/}
                            <label className='whole-line'>Шаблон</label>
                            <select
                                name="selectedTemplate"
                                required
                                className='select-add'
                                onChange={handleNumberSelect}
                                value={state.selectedTemplate}>
                                <option> </option>
                                {state.templates
                                    ? sortBy(state.templates
                                            .filter(c => state.selectedPlant ? c.plant == state.selectedPlant : c.plant)
                                        , 'plant')
                                        .map(item => (
                                            <option key={item.id} value={item.id}>{item.purpose}</option>
                                        ))
                                    : <option>{'no templates found'}</option>
                                }
                            </select>
                            {/*<label className='whole-line'>Фаза начала обработки</label>*/}
                            {/*<select*/}
                            {/*    name="selectedPhaseStart"*/}
                            {/*    required*/}
                            {/*    className='select-add'*/}
                            {/*    onChange={handleSelect}*/}
                            {/*    value={state.selectedPhaseStart}>*/}
                            {/*    <option> </option>*/}
                            {/*    {state.phases*/}
                            {/*        ? sortBy(state.phases, 'name')*/}
                            {/*            .map(item => (*/}
                            {/*                <option key={item.id} value={item.id}>{item.name}</option>*/}
                            {/*            ))*/}
                            {/*        : 'no phases in state'*/}
                            {/*    }*/}
                            {/*</select>*/}
                            {/*<label className='whole-line'>Фаза конца обработки</label>*/}
                            {/*<select*/}
                            {/*    name="selectedPhaseEnd"*/}
                            {/*    required*/}
                            {/*    className='select-add'*/}
                            {/*    onChange={handleSelect}*/}
                            {/*    value={state.selectedPhaseEnd}>*/}
                            {/*    <option> </option>*/}
                            {/*    {state.phases*/}
                            {/*        ? sortBy(state.phases, 'name')*/}
                            {/*            .map(item => (*/}
                            {/*                <option key={item.id} value={item.id}>{item.name}</option>*/}
                            {/*            ))*/}
                            {/*        : 'no phases in state'*/}
                            {/*    }*/}
                            {/*</select>*/}
                            {/*<label className='whole-line'>Кратность</label>*/}
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder='Кратность обработки'*/}
                            {/*    name='frequency'*/}
                            {/*    required*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    onChange={handleFreq}*/}
                            {/*    value={state.freq}/>*/}
                            {/*<label className='whole-line'>Промежуток между обработками</label>*/}
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder='Промежуток'*/}
                            {/*    name='gap'*/}
                            {/*    required*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    onChange={handleGap}*/}
                            {/*    value={state.gap}/>*/}
                            {/*<label className='whole-line'>Дозировка</label>*/}
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder=''*/}
                            {/*    name='dosage'*/}
                            {/*    required*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    onChange={handleStringValue}*/}
                            {/*    value={state.dosage}/>*/}
                            {/*<label className='whole-line'>Расход</label>*/}
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder=''*/}
                            {/*    name='volume'*/}
                            {/*    required*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    onChange={handleStringValue}*/}
                            {/*    value={state.volume}/>*/}
                            {/*<label className='whole-line'>Специальные условия</label>*/}
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder=''*/}
                            {/*    name='specCond'*/}
                            {/*    required*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    onChange={handleStringValue}*/}
                            {/*    value={state.specCond}/>*/}
                            <button  type='submit' className='add-button'>Добавить</button>
                            <button onClick={showAddTreatment} className='add-button'>Отмена</button>
                        </form>
                        : null }
                </div>
            </div>
            <div className='container table-container'>
                {state.treatments ?
                    state.treatments
                        .map((c: ITreatment) => (
                            <div className='component' key={c.id}>
                                <div><p>'ID:'</p>{c.id}</div>
                                <div><p>'Plant:'</p>{c.plant}</div>
                                <div><p>'Contents:'</p>{c.components.join(', ')}</div>
                            </div>
                        ),
                    ) : 'no treatments found'}
            </div>
        </div>
    )
}

