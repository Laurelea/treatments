import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import api from '../utils/api'

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
    newSubstanceName: string | undefined,
}

export const ShowComponents =  () => {
    const [state, setState] =  useState<IShowComponents>({
        components: undefined,
        showAddForm: false,
        showAddSubstance: false,
        substances: undefined,
        currentSubstance: undefined,
        newSubstanceName: undefined,
    })
    const handleNewSubstance = async (event: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, newSubstanceName: event.target.value ? event.target.value.toLowerCase() : undefined });
    }
    const addComponent = () => {
        console.info('add comp')
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
                            showAddSubstance: !state.showAddSubstance
                        })
                    }
                    window.alert(JSON.stringify(message))
                })
                .catch(error => {
                    console.info(error);
                })
        }
    }
    const selectSubstance = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.info('selectSubstance')
        setState({
            ...state,
            currentSubstance: Number(e.target.value) })
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
    const getSubstances = async () => {
        const substances = await api('get', 'show-substances');
        console.info('getSubstances data', substances)
        setState({
            ...state,
            substances,
        })
    }
    const getComponents = async () => {
        const components = await api('get', 'show-components');
        setState({
            ...state,
            components,
        })
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
        <div className='mainElement'>
            {state.showAddForm ?
                <form name='Форма для добавления нового компонента' id='CompAddForm' className='addForm'  onSubmit={addComponent}
                      autoComplete="on">
                    <h2 className='whole-line'>
                        Добавить новый компонент
                    </h2>
                    <label className='whole-line'>
                        Название препарата
                    </label>
                    <input type='text' placeholder='Название препарата' name='name' required autoComplete="on" className='whole-line add-input'/>
                    <label className='whole-line'>
                        Действующее вещество
                    </label>
                    <input type='text' placeholder='Выбрать из имеющихся' name='substance' autoComplete="on" className='whole-line add-input'/>
                    <select name="substance" required className='select-add' onChange={selectSubstance}>
                        <option> </option>
                        {state.substances
                            ? state.substances.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))
                            : 'no substances in state'
                        }
                    </select>
                    <div className='whole-line'>
                        <button type='submit' className='add-button'>Добавить</button>
                    </div>
                </form> :
                <button onClick={showAddComponent}>Добавить компонент</button>
            }
            {state.showAddSubstance ?
                <form name='Форма для добавления нового действующего вещества' id='SubAddForm' className='addForm' onSubmit={addSubstance}>
                    <h2 className='whole-line'>
                        Добавить действующее вещество
                    </h2>
                    <label className='whole-line'>
                        Название вещества
                    </label>
                    <input type='text' placeholder='Добавить новое' name='name' required autoComplete="on" className='whole-line add-input' onChange={handleNewSubstance}/>
                    <button  type='submit' className='add-button'>Добавить</button>
                </form> :
                <button onClick={showAddSubstance}>Добавить действующее вещество</button>
            }
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
    )
}

