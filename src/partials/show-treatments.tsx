import '../App.css';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import axios from "axios";
import { API_URL } from "../config";
import MuiTable from "src/components/MuiTable";
import api from "src/utils/api";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { sortBy } from "src/utils/utils";
import { Grid, Button, TextField, Typography, MenuItem } from '@mui/material';
import { IComponent, ITemplate } from "src/utils/types";


interface ITreatment {
    id?: number,
    template_id: number | null,
    status: string,
    date_started?: string,
    date_finished?: string,
    dates_to_do: string[],
    dates_done: string[],
    number_done: number,
    date_create: string,
    plant_name: string,
    type: string,
    apply_type: string,
    phase_start: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number,
    special_condition: string,
    contents: string[],
    dosage: string,
    volume: string
}

interface IShowTreatments {
    treatments: ITreatment[],
    statuses: string[],
    templates: ITemplate[],
    showAddTreatment: boolean,
    newTreatment: ITreatment | null,
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            margin: theme.spacing(1, 1),
            padding: theme.spacing(1, 1),
            // minHeight: 'calc(100vh - 120px)',
            maxWidth: 'calc(100vw - 20px)',
            backgroundColor: theme.palette.background.default,
            position: 'relative',
            justify: "center",
            border: '2px solid orange',
            // backgroundColor: "pink",
        },
        form: {
            // columns: 2,
            padding: theme.spacing(0, 5),
            margin: theme.spacing(2, 0),
            border: '2px solid black',
            display: 'grid',
            flexDirection: 'column',
            // display: 'grid';
            gridTemplateColumns: '1fr',
            '& button': {
                marginBottom: theme.spacing(2),
                marginRight: theme.spacing(2),
                // gridColumn: 'span 2',
                // clear: 'both'
                display: 'inline-block',
            },
            '& label': {
                marginBottom: theme.spacing(2),
                marginRight: theme.spacing(2),
                display: 'inline-block',
            },
        },
        addButton: {
            margin: theme.spacing(3, 3),
            // padding: theme.spacing(3, 3),
            width: 300,
        },
        formContainer: {
            padding: theme.spacing(1, 1),
            border: '2px solid blue',
            width: '100%'
        },
        mainContainer: {
            maxWidth: '2000px'
        },
        itemsContainer: {
            padding: theme.spacing(0, 2),
            border: '2px solid red',
        },
        header: {
            padding: theme.spacing(2),
            // gridColumn: 'span 2',
            // justifySelf: 'center'
        },
        textField: {
            width: 300,
            marginRight: theme.spacing(2),
            marginLeft: theme.spacing(2),
            border: '2px solid pink',
        },
        submit: {
            marginTop: theme.spacing(5),
            padding: theme.spacing(3, 3),
            width: 500,
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

export const ShowTreatments =  () => {
    const classes = useStyles();
    // t.id,
    //     t.date_create,
    //     t.status,
    //     p.plant_name,
    //     type,
    //     apply_type,
    //     tt.phase_start,
    //     tt.phase_end,
    //     t.date_started,
    //     t.date_finished,
    //     t.dates_to_do,
    //     t.dates_done,
    //     t.number_done,
    //     tt.frequency,
    //     tt.treatment_gap,
    //     tt.special_condition,
    //     tt.dosage,
    //     tt.volume`;
    const defaultTreatment = {
        template_name: '',
        date_create: '',
        status: '',
        plant_name: '',
        type: '',
        apply_type: '',
        phase_start: '',
        phase_end: '',
        date_started: '',
        date_finished: '',
        dates_to_do: [],
        dates_done: [],
        number_done: 0,
        frequency: '',
        treatment_gap: '',
        special_condition: '',
        contents: [],
        dosage: '',
        volume: ''
    }
    const [state, setState] =  useState<IShowTreatments>({
        treatments: [],
        statuses: [],
        templates: [],
        showAddTreatment: false,
        // newTreatment: { ...defaultTreatment }
        newTreatment: null
    })

    const getInitialData = async () => {
        const templates = await api('get', 'show-templates');
        const statuses = await api('get', 'get-statuses');
        // const plants = await api('get', 'get-plants');
        // const phases = await api('get', 'get-phases');
        // const treatment_types = await api('get', 'get-treatment-types');
        // const treatment_apply_types = await api('get', 'get-treatment-apply-types');
        // const components = await api('get', 'show-components');
        const treatments = await api('get', 'show-treatments');
        console.info(139, treatments)
        setState({
            ...state,
            templates,
            statuses,
            // plants: sortBy(plants, 'plant_name'),
            // phases: phases.sort(),
            // treatment_types,
            // treatment_apply_types,
            // components
            treatments: treatments || [],
            newTreatment: null
        })
    }

    useEffect(() => {
        try {
            getInitialData();
        } catch (error) {
            console.error(103, error);
        }
    }, [])

    const addTreatment = async (event: FormEvent) => {
        event.preventDefault();
        console.info('add treatment:', state.newTreatment)
        if (!state.newTreatment || !state.newTreatment.template_id) {
            window.alert('не выбран шаблон обработки')
            return
        } else {
            try {
                const res = await axios.post(
                    `${API_URL}/add-treatment`,
                    {
                        ...state.newTreatment,
                    }
                );
                if (res.data.error) {
                    window.alert(res.data.error)
                } else {
                    getInitialData()
                    window.alert('success')
                }
            } catch (e) {
                console.info(235, e);
            }

        }
    }

    const handleChange = (name: keyof ITreatment) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.info(215, value)
        setState({
            ...state,
            newTreatment: {
                ...(state.newTreatment) as ITreatment,
                [name]: value,
            } as ITreatment
        });
    }

    return (
        <div className={classes.root}>
            <Grid item container xs={12}>
                <Grid className={classes.formContainer}>
                    {state.showAddTreatment ?
                        <Grid className={classes.form} component="form" onSubmit={addTreatment}>
                            <Typography component="span" variant="h5" className={classes.header}>Добавить новую обработку</Typography>
                            <TextField
                                select
                                id="treatment-template"
                                label="Шаблон"
                                value={state.newTreatment ? state.newTreatment.template_id : ''}
                                onChange={handleChange('template_id')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                required
                            >
                                {state.templates.length && state.templates.map((item: ITemplate) => (
                                    <MenuItem key={item.id} value={item.id}>{item.plant_name}-{item.type}-{item.template_name}</MenuItem>
                                )) || []}
                            </TextField>
                            {/*<TextField*/}
                            {/*    id="status"*/}
                            {/*    label="Статус"*/}
                            {/*    value={state.newTreatment ? state.newTreatment.status : ''}*/}
                            {/*    onChange={handleChange('status')}*/}
                            {/*    className={classes.textField}*/}
                            {/*    margin="normal"*/}
                            {/*    variant="outlined"*/}
                            {/*    required*/}
                            {/*>*/}
                            {/*    {state.statuses.length && state.statuses.map((item: string, k: number) => (*/}
                            {/*        <MenuItem key={k} value={item}>{item}</MenuItem>*/}
                            {/*    )) || []}*/}
                            {/*</TextField>*/}
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
                            onClick={() => setState({ ...state, showAddTreatment: true })}
                            variant="contained"
                            color="primary"
                            // type="submit"
                            // disabled={state.isLoading}
                            className={classes.addButton}
                        >
                            {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                            Добавить обработку
                        </Button>
                    }
                </Grid>
                <Grid container className={classes.itemsContainer}>
                    {state.treatments && state.treatments.length ?
                        <MuiTable
                            data={state.treatments}
                            fields={{
                                'ID': 'id',
                                'Дата создания': 'date_create',
                                'Название шаблона': 'template_name',
                                'Растение': 'plant_name',
                                'Назначение': 'type',
                                'Способ': 'apply_type',
                                'Состав': 'contents',
                                'Фаза начала': 'phase_start',
                                'Фаза конца': 'phase_end',
                                'Кратность': 'frequency',
                                'Промежуток между': 'treatment_gap',
                                'Дозировка': 'dosage',
                                'Объём': 'volume',
                                'Спец.условие': 'special_condition',
                                'Статус': 'status',
                                'Дата начала': 'date_started',
                                'Дата окончания': 'date_finished',
                                'Будущие даты обработок': 'dates_to_do',
                                'Прошедшие даты обработок': 'dates_done',
                                'Обработок сделано': 'number_done',
                            }}
                        />
                        : 'no treatments found'}
                </Grid>
            </Grid>
        </div>
    )
}
