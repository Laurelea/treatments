import '../App.css';
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { API_URL } from "../config";

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
}

export const ShowComponents =  () => {
    const getComponents = async () => {
        console.log('getComponents triggered')
        return await axios.get(`${API_URL}/show-components`, {})
            .then( async response => {
                console.info("show-components post.response.data: ", response.data);
                if (response.data) {
                    // setState({
                    //     ...state,
                    //     components: response.data
                    // });
                    return await response.data
                } else {
                    throw new Error('getComponents: no data in response')
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
    const getSubstances = async () => {
        console.log('getSubstances triggered')
        return await axios.get(`${API_URL}/show-substances`, {})
            .then(async response => {
                console.info("show-substances post.response.data: ", response.data);
                if (response.data) {
                    return await response.data
                } else {
                    throw new Error('getSubstances: no data in response')
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
    const addComponent = () => {
        console.info('add comp')
    }
    const addSubstance = async (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        event.preventDefault();
        console.info('add substance:', event.currentTarget.getAttribute('name'))
        console.info('add substance 2:', formData)
        // console.info('add substance:', event.currentTarget)
        const data = {
            name: event.currentTarget.name,
        }
        event.currentTarget.reset();
        await axios.post(`${API_URL}/add-substance`, data)
            .then(response => {
                console.log("addSubstance  post.response.data: ", response.data);
                if (response.data.success) {
                    console.log('addSubstance success')
                    window.alert(response.data.message)
                    setState({
                        ...state,
                        showAddSubstance: !showAddSubstance
                    })
                }
                return response.data.message
            })
            .then(message => {
                window.alert(message)
            })
            .catch(error => {
                console.log(error);
            })
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
    const [state, setState] =  useState<IShowComponents>({
        components: undefined,
        showAddForm: false,
        showAddSubstance: false,
        substances: undefined,
        currentSubstance: undefined,
    })
    const asd = async () => {
        1 = await getSubstances();
        2 = await getSubstances();
        setState(1, 2)
    }
    useEffect(() => {
        let substances: Array<ISubstance>
        let components: Array<IComponent>
        asd()
        getSubstances()
            .then(data => {
                console.log('useEffect getSubstances', data)
                if (data) {
                    substances = data
                }
            })
            .then(() => {
                getComponents()
                    .then(data => {
                        console.log('useEffect getComponents', data)
                        if (data) {
                            components = data
                        }
                    })
                    .then(() => {
                        setState({
                            ...state,
                            substances,
                            components
                        });
                    })
            })
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
                    <input type='text' placeholder='Добавить новое' name='name' required autoComplete="on" className='whole-line add-input'/>
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

