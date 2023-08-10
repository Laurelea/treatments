import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axios from "axios";
import { API_URL } from "../config";
import api from '../utils/api';
import Grid from '@mui/material/Grid';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Container from '@mui/material/Container';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

interface IComponent {
    id: number,
    component_name: string,
    substances: string[],
}

interface ISubstance {
    id: number,
    substance_name: string,
}

interface IShowComponents {
    components: Array<IComponent> | undefined,
    showAddComponent: boolean,
    showAddSubstance: boolean,
    substances: Array<ISubstance> | undefined,
    newSubstanceName: string,
    newComponentName: string,
    newComponentSubstances: number[],
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(0),
            minHeight: 'calc(100vh - 120px)',
            width: '100%',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            justify: "center"
            // backgroundColor: "pink",
        },
        form: {
            padding: theme.spacing(0, 2),
            margin: theme.spacing(2, 0),
            border: '2px solid black',
            alignItems: "flex-start",
            // justifyContent: "space-between",
            display: 'flex',
            flexDirection: 'column',
        },
        formContainer: {
            padding: theme.spacing(0, 2),
            border: '2px solid blue',
        },
        itemsContainer: {
            padding: theme.spacing(0, 2),
            border: '2px solid red',
        },
        textField: {
            width: 300,
            marginRight: theme.spacing(2),
        },
        submit: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2, 3),
        },
        checkbox: {
            marginTop: theme.spacing(2),
        },
        modeSelector: {
            padding: theme.spacing(2),
        },
        modeButton: {
            marginRight: theme.spacing(2),
        },
        active: {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.background.default,
        },
    }),
);

export const ShowComponents = () => {
    const classes = useStyles();
    const [state, setState] =  useState<IShowComponents>({
        components: undefined,
        showAddComponent: false,
        showAddSubstance: false,
        substances: undefined,
        newSubstanceName: '',
        newComponentName: '',
        newComponentSubstances: [],
    })
    const handleNewSubstance = async (event: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, newSubstanceName: event.target.value ? event.target.value.toLowerCase() : '' });
    }
    const handleNewComponent = async (event: ChangeEvent<HTMLInputElement>) => {
        setState({ ...state, newComponentName: event.target.value ? event.target.value.toLowerCase() : '' });
    }
    // const handleNewComponentSubstances = async (event: ChangeEvent<HTMLInputElement>) => {
    //     setState({ ...state, newComponentSubstances: event.target.value ? event.target.value.toLowerCase() : '' });
    // }
    const addComponent = (event: FormEvent) => {
        event.preventDefault();
        console.info('add comp:', state.newComponentName, state.newComponentSubstances)
    }
    const addSubstance = async (event: FormEvent) => {
        event.preventDefault();
        console.info('add substance:', state.newSubstanceName)
        if (!state.newSubstanceName) {
            window.alert('не введено имя вещества')
            return
        } else {
            try {
                const res = await axios.post(`${API_URL}/add-substance`, { substance_name: state.newSubstanceName });
                if (res.data.error) {
                    window.alert(res.data.error)
                } else {
                    getSubstances()
                    window.alert('success')
                }
            } catch (e) {
                console.info(e);
            }

        }
    }
    const handleNewComponentSubstances = (e: SelectChangeEvent<number[]> | ChangeEvent) => {
        const { selectedOptions } = e.target as HTMLSelectElement;
        setState({
            ...state,
            newComponentSubstances: Array.from(selectedOptions).map(o => Number(o.value))
        });
    }
    const showAddComponent =  () => {
        setState({
            ...state,
            showAddComponent: !state.showAddComponent,
            showAddSubstance: false,
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
            newSubstanceName: '',
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
        const substances = await api('get', 'show-substances');
        const components = await api('get', 'show-components');
        setState({
            ...state,
            substances,
            components,
            newSubstanceName: '',
        })
    }

    useEffect(() => {
        getInitialData();
    }, [])
    return (
        <div className={classes.root}>
            <Container>
                <Grid container className={classes.formContainer}>
                    {state.showAddComponent ?
                        <form
                            name='Форма для добавления нового компонента'
                            id='CompAddForm'
                            className={classes.form}
                            onSubmit={addComponent}
                            autoComplete="on"
                        >
                            <h2 className='whole-line'>
                                Добавить новый компонент
                            </h2>
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
                                onChange={handleNewComponent}
                            />
                            <label className='whole-line'>Действующие вещества</label>
                            {/*<input*/}
                            {/*    type='text'*/}
                            {/*    placeholder='Выбрать из имеющихся'*/}
                            {/*    name='substances'*/}
                            {/*    autoComplete="on"*/}
                            {/*    className='whole-line add-input'*/}
                            {/*    // onChange={handleNewComponentSubstances}*/}
                            {/*    // value={state.newComponentSubstances}*/}
                            {/*/>*/}
                            {/*<Select*/}
                            {/*    multiple*/}
                            {/*    native*/}
                            {/*    disableUnderline*/}
                            {/*    value={state.selectedSavedRequest ? [state.selectedSavedRequest] : []}*/}
                            {/*    onChange={handleChangeSavedRequest}*/}
                            {/*    inputProps={{*/}
                            {/*        id: 'select-multiple-native',*/}
                            {/*    }}*/}
                            {/*>*/}
                            <Select
                                required
                                onChange={handleNewComponentSubstances}
                                multiple
                                native
                                value={state.newComponentSubstances || []}
                            >
                                {state.substances
                                    ? state.substances
                                        .sort((a, b) => (
                                            a.substance_name > b.substance_name ?
                                                1 :
                                                b.substance_name > a.substance_name ?
                                                -1 : 0
                                            ))
                                        .map(item => (
                                        <option key={item.id} value={Number(item.id)}>{item.substance_name}</option>
                                    ))
                                    : 'no substances in state'
                                }
                            </Select>
                            <div className='whole-line'>
                                <button type='submit' className='add-button'>Добавить</button>
                            </div>
                        </form>
                        :
                        <button onClick={showAddComponent}>Добавить компонент</button>
                    }
                </Grid>
                <Grid container className={classes.formContainer}>
                    {state.showAddSubstance ?
                        <form
                            name='Форма для добавления нового действующего вещества'
                            id='SubAddForm'
                            className={classes.form}
                            onSubmit={addSubstance}
                        >
                            <h2 className='whole-line'>
                                Добавить действующее вещество
                            </h2>
                            <label className='whole-line'>
                                Название вещества
                            </label>
                            <input
                                type='text'
                                placeholder='Добавить новое'
                                name='name'
                                required
                                // autoComplete="on"
                                className='whole-line add-input'
                                onChange={handleNewSubstance}
                                value={state.newSubstanceName}
                            />
                            <button  type='submit' className='add-button'>Добавить</button>
                        </form>
                        :
                        <button onClick={showAddSubstance}>Добавить действующее вещество</button>
                    }
                </Grid>
                <Grid container className={classes.itemsContainer}>
                    {state.components && state.components.length ?
                            state.components.map((c: IComponent) => (
                                <div className='component' key={c.id}>
                                    <div><p>'ID:'</p>{c.id}</div>
                                    <div><p>'Component name:'</p>{c.component_name}</div>
                                    <div><p>'Substances:'</p>{c.substances.join(', ')}</div>
                                </div>
                                ),
                            )
                        : 'no components found'}
                </Grid>
            </Container>
        </div>
    )
}

