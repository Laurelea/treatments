import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axios from "axios";
import { API_URL } from "../config";
import api from '../utils/api';
import Grid from '@mui/material/Grid';
import { Container, Typography, TextField } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { IComponent, ISubstance } from "src/utils/types";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { sortBy } from '../utils/utils';
import MuiTable from '../components/MuiTable';


interface IShowComponents {
    components: IComponent[],
    showAddComponent: boolean,
    showAddSubstance: boolean,
    substances: ISubstance[],
    newSubstanceName: string,
    newComponent: IComponent,
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
            // alignItems: "flex-start",
            // justifyContent: "space-between",
            display: 'grid',
            flexDirection: 'column',
            '& button': {
                marginBottom: theme.spacing(2),
                marginRight: theme.spacing(2),
                // gridColumn: 'span 2',
                display: 'inline-block',
            },
        },
        header: {
            padding: theme.spacing(2),
        },
        formContainer: {
            padding: theme.spacing(1, 2),
            border: '2px solid blue',
        },
        itemsContainer: {
            padding: theme.spacing(0, 2),
            border: '2px solid red',
        },
        textField: {
            width: 300,
            marginRight: theme.spacing(2),
            marginLeft: theme.spacing(2),
            border: '2px solid pink',
        },
        addButton: {
            margin: theme.spacing(3, 3),
            padding: theme.spacing(3, 3),
            width: 300,
        },
        submit: {
            marginTop: theme.spacing(5),
            padding: theme.spacing(3, 3),
            width: 300,
            textAlign: 'center',
            alignSelf: 'center',
            // justifySelf: 'center',
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
    const defaultComponent = {
        component_name: '',
        substances: [],
        description: ''
    };
    const [state, setState] =  useState<IShowComponents>({
        components: [],
        showAddComponent: false,
        showAddSubstance: false,
        substances: [],
        newSubstanceName: '',
        newComponent: {
            ...defaultComponent
        }
    })
    const handleChangeComponent = (name: keyof IComponent) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setState({
            ...state,
            newComponent: {
                ...state.newComponent,
                [name]: value,
            } as IComponent
        });
    }
    const addComponent = async (event: FormEvent) => {
        event.preventDefault();
        console.info('add comp:', state.newComponent)
        if (state.newComponent.component_name === '') {
            window.alert('не введено имя компонента')
            return
        } else {
            try {
                const res = await axios.post(
                    `${API_URL}/add-component`,
                    {
                        component_name: state.newComponent.component_name.toLowerCase(),
                        description: state.newComponent.description.toLowerCase(),
                        substances: state.newComponent.substances,
                    }
                );
                if (res.data.error) {
                    window.alert(res.data.error)
                } else {
                    getComponents()
                    window.alert('success')
                }
            } catch (e) {
                console.info(143, e);
            }

        }
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

    const getSubstances = async () => {
        const substances = await api('get', 'show-substances');
        setState({
            ...state,
            substances: sortBy(substances, 'substance_name'),
            newSubstanceName: '',
        })
    }

    const getComponents = async () => {
        const components = await api('get', 'show-components');
        setState({
            ...state,
            components,
            newComponent: { ...defaultComponent }
        })
    }

    const getInitialData = async () => {
        const substances = await api('get', 'show-substances');
        const components = await api('get', 'show-components');
        setState({
            ...state,
            substances: sortBy(substances, 'substance_name'),
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
                        <Grid
                            component='form'
                            className={classes.form}
                            name='Форма для добавления нового компонента'
                            id='CompAddForm'
                            onSubmit={addComponent}
                            autoComplete="on"
                        >
                            <Typography component="span" variant="h5" className={classes.header}>Добавить новый компонент</Typography>
                            <TextField
                                id="component-name"
                                label="Название препарата"
                                value={state.newComponent.component_name}
                                onChange={handleChangeComponent('component_name')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                required
                            />
                            <TextField
                                select
                                id="component-substances"
                                label="Действующие вещества"
                                value={state.newComponent.substances}
                                onChange={handleChangeComponent('substances')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: true }}
                                required
                            >
                                {state.substances.length && state.substances.map((item: ISubstance) => (
                                    <MenuItem key={item.id} value={item.id}>{item.substance_name}</MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                id="component-description"
                                label="Описание"
                                value={state.newComponent.description}
                                onChange={handleChangeComponent('description')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                // disabled={state.isLoading}
                                className={classes.submit}
                            >
                                {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                                Добавить
                            </Button>
                        </Grid>
                        :
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setState({
                                ...state,
                                showAddComponent: !state.showAddComponent,
                                showAddSubstance: false,
                            })}
                            // disabled={state.isLoading}
                            className={classes.addButton}
                        >
                            {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                            Добавить компонент
                        </Button>
                    }
                </Grid>
                <Grid container className={classes.formContainer}>
                    {state.showAddSubstance ?
                        <Grid
                            component='form'
                            className={classes.form}
                            name='Форма для добавления нового действующего вещества'
                            id='SubAddForm'
                            onSubmit={addSubstance}
                            autoComplete="on"
                        >
                            <Typography component="span" variant="h5" className={classes.header}>Добавить действующее вещество</Typography>
                            <TextField
                                id="substance-name"
                                label="Название вещества"
                                value={state.newSubstanceName}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setState({ ...state, newSubstanceName: e.target.value })}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                required
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                // disabled={state.isLoading}
                                className={classes.submit}
                            >
                                {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                                Добавить
                            </Button>
                        </Grid>
                        :
                        // <button onClick={showAddSubstance}>Добавить действующее вещество</button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setState({
                                ...state,
                                showAddSubstance: !state.showAddSubstance
                            })}
                            // disabled={state.isLoading}
                            className={classes.addButton}
                        >
                        {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                        Добавить действующее вещество
                        </Button>
                    }
                </Grid>
                <Grid container className={classes.itemsContainer}>
                    <MuiTable
                        data={state.components}
                        fields={{
                            'ID': 'id',
                            'Название компонента': 'component_name',
                            'Состав': 'substances',
                            'Описание': 'description'
                        }}
                    />
                </Grid>
            </Container>
        </div>
    )
}

