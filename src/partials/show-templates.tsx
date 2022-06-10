import '../App.css';
import React, { useState, useEffect } from 'react'
import { sortBy } from "src/utils/funcs";
import api from '../utils/api'

interface ITemplate {
    id: number,
    plant: string,
    purpose: string,
    contents: Array<string>,
    phase_begin: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number | null,
    special_condition: string | null,
    type: string,
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
        // const substances = await api('get', 'show-substances');
        setState({
            ...state,
            templates,
            products,
            types,
            applyTypes,
            // substances
        })
    }
    const addTemplate = () => {
        return
    }
    const handleSelect =  (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info('select', e.target.name)
        setState({
            ...state,
            [e.target.name]: Number(e.target.value) })
    }

    const handlePurposeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            purposeName: e.target.value })
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
                            name='purpose'
                            required
                            autoComplete="on"
                            className='whole-line add-input'
                            onChange={handlePurposeName}
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


                    </form> : null }
                </div>
            </div>
            <div className='container table-container'>

            {state.templates ?
                state.templates.map((c: ITemplate) => (
                        <div className='component' key={c.id}>
                            <div><p>'ID:'</p>{c.id}</div>
                            <div><p>'Plant:'</p>{c.plant}</div>
                            <div><p>'Contents:'</p>{c.contents}</div>
                            <div><p>'Phase begin:'</p>{c.phase_begin}</div>
                            <div><p>'Phase end:'</p>{c.phase_end}</div>
                        </div>
                    ),
                ) : 'no components found'}
                </div>
        </div>

    )
}

export default ShowTemplates
