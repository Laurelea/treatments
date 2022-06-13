import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import api from '../utils/api'
import { sortBy } from '../utils/funcs'
import { IComponent } from '../utils/types'

interface IShowPhases{
    phases: Array<{ id: number, name: string }> | undefined,
    showAddForm: boolean,
    newPhaseName: string,
}

export const ShowPhases =  () => {
    const [state, setState] =  useState<IShowPhases>({
        phases: undefined,
        showAddForm: false,
        newPhaseName: '',
    })
    const handleNewPhase = async (event: ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            newPhaseName: event.target.value ? event.target.value.toLowerCase() : ''
        });
    }
    const addPhase = async (event: FormEvent) => {
        event.preventDefault();
        if (!state.newPhaseName) {
            window.alert('не введено имя фазы')
            return
        } else {
            await api('post', 'add-phase', { name: state.newPhaseName })
                .then(async res => {
                    const { success, message } = await res
                    if (success) {
                        const phases = await api('get', 'get-phases');
                        setState({
                            ...state,
                            phases,
                            newPhaseName: '',
                        })
                    }
                    window.alert(JSON.stringify(message))
                })
                .catch(error => {
                    console.info(error);
                })
        }
    }

    const showAddPhase =  () => {
        setState({
            ...state,
            showAddForm: !state.showAddForm
        });
        console.info('show comp')

    }
    const getInitialData = async () => {
        const phases = await api('get', 'get-phases');
        setState({
            ...state,
            phases
        })
    }
    useEffect(() => {
        getInitialData()
    }, [])

    return (
        <div className='container main-container'>
            <div className='container controller-container'>
                <div className='container buttons-container'>
                    <button onClick={showAddPhase} className='add-button'>Добавить фазу</button>
                </div>
                <div className='container controller-contents-container'>
                    {state.showAddForm ?
                        <form name='Форма для добавления новой фазы' id='PhaseAddForm' className='add-phase-form' onSubmit={addPhase}
                              autoComplete="on">
                            <h3 className='whole-line'>
                                Добавить новую фазу
                            </h3>
                            <label className='whole-line'>
                                Название фазы
                            </label>
                            <input
                                type='text'
                                placeholder='Название фазы'
                                name='name'
                                required
                                autoComplete="on"
                                className='whole-line add-input'
                                onChange={handleNewPhase}
                                value={state.newPhaseName}/>
                            <button type='submit' className='add-button'>Добавить</button>
                            <button onClick={showAddPhase} className='add-button'>Отмена</button>
                        </form> :
                        null
                    }
                </div>
            </div>
            <div className='container table-container'>
                {state.phases ?
                    state.phases.map((c: { id: number, name: string }) => (
                            <div className='component' key={c.id}>
                                <div><p>'ID:'</p>{c.id}</div>
                                <div><p>'Name:'</p>{c.name}</div>
                            </div>
                        ),
                    ) : 'no components found'}
            </div>
        </div>
    )
}

