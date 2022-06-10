import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import api from '../utils/api'
import { sortBy } from '../utils/funcs'

interface IComponent {
    id: number,
    name: string,
    substance: string,
}

interface ISubstance {
    id: number,
    name: string,
}

interface IShowComponents {
    components: Array<IComponent> | undefined,
    showAddForm: boolean,
    showAddSubstance: boolean,
    substances: Array<ISubstance> | undefined,
    currentSubstance: number | undefined,
    newSubstanceName: string,
    newComponentName: string,
}

export const ShowComponents =  () => {
    const [state, setState] =  useState<IShowComponents>({
        components: undefined,
        showAddForm: false,
        showAddSubstance: false,
        substances: undefined,
        currentSubstance: undefined,
        newSubstanceName: '',
        newComponentName: '',
    })
    const handleNewSubstance = async (event: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, newSubstanceName: event.target.value ? event.target.value.toLowerCase() : '' });
    }
    const addComponent = async (event: FormEvent)  => {
        event.preventDefault();
        console.info('add component:', state.newComponentName)
        if (!state.newComponentName) {
            window.alert('не введено имя компонента')
            return
        } else {
            await api('post', 'add-component', { name: state.newComponentName, substance: state.currentSubstance })
                .then(async res => {
                    const { success, message } = await res
                    if (success) {
                        const components = await api('get', 'show-components');
                        setState({
                            ...state,
                            components,
                            // showAddForm: !state.showAddForm,
                            currentSubstance: undefined,
                            newComponentName: '',
                        })
                    } else {
                        setState({
                            ...state,
                            // showAddForm: !state.showAddForm,
                            currentSubstance: undefined,
                            newComponentName: '',
                        })
                    }
                    window.alert(JSON.stringify(message))
                })
                .catch(error => {
                    console.info(error);
                })
        }
    }
    const addSubstance = async (event: FormEvent) => {
        event.preventDefault();
        console.info('add substance:', state.newSubstanceName)
        if (!state.newSubstanceName) {
            window.alert('не введено имя вещества')
            return
        } else {
            await api('post', 'add-substance', { name: state.newSubstanceName })
                .then(async res => {
                    const { success, message } = await res
                    if (success) {
                        const substances = await api('get', 'show-substances');
                        setState({
                            ...state,
                            substances,
                            newSubstanceName: '',
                            // showAddSubstance: !state.showAddSubstance
                        })
                        // event.currentTarget.reset();
                    }
                    window.alert(JSON.stringify(message))
                })
                .catch(error => {
                    console.info(error);
                })
        }
    }
    const selectSubstance = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setState({
            ...state,
            currentSubstance: Number(e.target.value) })
    }
    const handleCompName = (e: React.ChangeEvent<HTMLInputElement>)  => {
        console.info('changeComp')
        setState({
            ...state,
            newComponentName: e.target.value })
    }
    const showAddComponent =  () => {
        setState({
            ...state,
            showAddForm: !state.showAddForm
        });
        console.info('show comp')

    }
    const showAddSubstance = () => {
        setState({
            ...state,
            showAddSubstance: !state.showAddSubstance
        });
        console.info('show comp')
    }
    const getInitialData = async () => {
        const components = await api('get', 'show-components');
        const substances = await api('get', 'show-substances');
        setState({
            ...state,
            components,
            substances
        })
    }

    useEffect(() => {
        getInitialData()
    }, [])

    return (
        <div className='container main-container'>
            <div className='container controller-container'>
                <div className='container buttons-container'>
                    <button onClick={showAddSubstance} className='add-button'>Добавить действующее вещество</button>
                    <button onClick={showAddComponent} className='add-button'>Добавить компонент</button>
                </div>
                <div className='container controller-contents-container'>
                    {state.showAddForm ?
                        <form name='Форма для добавления нового компонента' id='CompAddForm' className='add-component-form'  onSubmit={addComponent}
                              autoComplete="on">
                            <h3 className='whole-line'>
                                Добавить новый компонент
                            </h3>
                            <label className='whole-line'>
                                Название препарата
                            </label>
                            <input
                                type='text'
                                placeholder='Название препарата'
                                name='name'
                                required
                                autoComplete="on"
                                className='whole-line add-input'
                                onChange={handleCompName}
                                value={state.newComponentName}/>
                            <label className='whole-line'>
                                Действующее вещество
                            </label>
                            <select
                                name="substance"
                                required
                                className='select-add'
                                onChange={selectSubstance}
                                value={state.currentSubstance}>
                                <option> </option>
                                {state.substances
                                    ? sortBy(state.substances, 'name')
                                        .map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                    : 'no substances in state'
                                }
                            </select>
                            {/*<div className='buttons-container'>*/}
                                <button type='submit' className='add-button'>Добавить</button>
                                <button onClick={showAddComponent} className='add-button'>Отмена</button>
                            {/*</div>*/}
                        </form> :
                        null
                    }
                    {state.showAddSubstance ?
                        <form name='Форма для добавления нового действующего вещества' id='SubAddForm' className='add-substance-form' onSubmit={addSubstance}>
                            <h3 className='whole-line'>
                                Добавить действующее вещество
                            </h3>
                            <label className='whole-line'>
                                Название вещества
                            </label>
                            <input
                                type='text'
                                placeholder='Добавить новое'
                                name='name'
                                required
                                autoComplete="on"
                                className='whole-line add-input'
                                onChange={handleNewSubstance}
                                value={state.newSubstanceName}/>
                            {/*<div className='whole-line'>*/}
                                <button  type='submit' className='add-button'>Добавить</button>
                                <button onClick={showAddSubstance} className='add-button'>Отмена</button>
                            {/*</div>*/}
                        </form>
                        :
                        null
                    }
                </div>
            </div>
            <div className='container table-container'>
                {state.components ?
                    state.components.map((c: IComponent) => (
                            <div className='component' key={c.id}>
                                <div><p>'ID:'</p>{c.id}</div>
                                <div><p>'Name:'</p>{c.name}</div>
                                <div><p>'Substance:'</p>{c.substance}</div>
                            </div>
                        ),
                    ) : 'no components found'}
            </div>
        </div>
    )
}

