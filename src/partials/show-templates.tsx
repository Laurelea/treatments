import '../App.css';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import axios from "axios";
import { API_URL } from "../config";
import Grid from '@mui/material/Grid';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import api from "src/utils/api";

interface ITemplate {
    id?: number,
    template_name?: string,
    plant_id?: number,
    plant_name?: string,
    contents: Array<string>,
    phase_start: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number | null,
    special_condition: string | null,
    apply_type: string,
}

interface IPlant {
    id: number,
    plant_name: string,
    year_type: string,
    rootstock: string,
    soil: string,
    watering: string,
    planting_depth: string,
    category: number,
    sun: string,
}

interface ITemplates {
    templates: ITemplate[],
    showAddTemplate: boolean,
    newTemplate: ITemplate | null,
    plants: IPlant[],
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
                display: 'inline-block',
            },
            '& label': {
                marginBottom: theme.spacing(2),
                marginRight: theme.spacing(2),
                display: 'inline-block',
            },
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
            border: '2px solid pink',
        },
        submit: {
            marginTop: theme.spacing(2),
            padding: theme.spacing(2, 3),
            width: 150
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


const ShowTemplates = () => {
    const classes = useStyles();
    const [state, setState] =  useState<ITemplates>({
        templates: [],
        showAddTemplate: false,
        newTemplate: null,
        plants: []
    })

    const getInitialData = async () => {
        const templates = await api('get', 'show-templates');
        const plants = await api('get', 'get-plants');
        setState({
            ...state,
            templates,
            plants: plants.sort((a:IPlant, b:IPlant) => (
                a.plant_name > b.plant_name ?
                    1 :
                    b.plant_name > a.plant_name ?
                        -1 : 0
            )),
        })
    }

    useEffect(() => {
        try {
            getInitialData();
        } catch (error) {
            console.error(103, error);
        }
    }, [])

    const addTemplate = async (event: FormEvent) => {
        console.info()
    }

    const handleChange = (name: keyof ITemplate) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setState({
            ...state,
            newTemplate: {
                ...state.newTemplate,
                [name]: value,
            } as ITemplate,
        });
    }
    return (
        <div className={classes.root}>
            <Container>
                {state.showAddTemplate ?
                    <Grid className={classes.form} component="form" onSubmit={addTemplate}>
                        {/*<h2 className='whole-line'>*/}
                        {/*    Добавить новый шаблон обработки*/}
                        {/*</h2>*/}
                        <TextField
                            id="template-name"
                            label="Название шаблона"
                            value={state.newTemplate ? state.newTemplate.template_name : ''}
                            onChange={handleChange('template_name')}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            select
                            id="select-plant"
                            label="Растение"
                            value={state.newTemplate ? state.newTemplate.plant_id: null}
                            onChange={handleChange('plant_id')}
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            SelectProps={{ multiple: false }}
                            // autoFocus
                        >
                            {state.plants && state.plants.map((item: IPlant) => (
                                <MenuItem key={item.id} value={item.id}>{item.plant_name}</MenuItem>
                            )) || []}
                        </TextField>
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
                        onClick={() => setState({ ...state, showAddTemplate: true })}
                        variant="contained"
                        color="primary"
                        // type="submit"
                        // disabled={state.isLoading}
                        className={classes.submit}
                    >
                        {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                        Добавить шаблон
                    </Button>
                }
                <Grid container className={classes.itemsContainer}>
                    {state.templates && state.templates.length ?
                        state.templates.map((c: ITemplate) => (
                            <div className='component' key={c.id}>
                                <div><p>'ID:'</p>{c.id}</div>
                                <div><p>'Name:'</p>{c.template_name}</div>
                                <div><p>'Plant:'</p>{c.plant_name}</div>
                                <div><p>'Contents:'</p>{c.contents}</div>
                                <div><p>'Phase begin:'</p>{c.phase_start}</div>
                                <div><p>'Phase end:'</p>{c.phase_end}</div>
                            </div>
                            ),
                        ) : 'no templates found'}
                </Grid>
            </Container>
        </div>
    )
}

export default ShowTemplates
