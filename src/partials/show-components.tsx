import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axios from "axios";
import { API_URL } from "../config";
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
            await axios.post(`${API_URL}/add-substance`, { name: state.newSubstanceName })
                .then(response => {
                    if (response.data.error) {
                        return response.data.error
                    }
                    if (response.data) {
                        getSubstances()
                        return 'success'
                    }
                })
                .then(message => {
                    window.alert(message)
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

    // const getInitialData = async () => {
    //     const substances = await api('get', 'show-substances');
    //     const components = await api('get', 'show-components');
    //     setState({
    //         ...state,
    //         substances,
    //         components
    //     })
    // }
    useEffect(() => {
        // let substances: Array<ISubstance>
        // let components: Array<IComponent>
        getSubstances()
        getComponents()
        // getSubstances()
        //     .then(data => {
        //         console.log('useEffect getSubstances', data)
        //         if (data) {
        //             substances = data
        //         }
        //     })
        //     .then(() => {
        //         getComponents()
        //             .then(data => {
        //                 console.log('useEffect getComponents', data)
        //                 if (data) {
        //                     components = data
        //                 }
        //             })
        //             .then(() => {
        //                 setState({
        //                     ...state,
        //                     substances,
        //                     components
        //                 });
        //             })
        //     })
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

