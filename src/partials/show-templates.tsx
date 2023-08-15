import '../App.css';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import axios from "axios";
import { API_URL } from "../config";
import Grid from '@mui/material/Grid';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import { TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import api from "src/utils/api";
import { IComponent } from "src/utils/types";
import MuiTable from "src/components/MuiTable";
import { sortBy } from "src/utils/utils";


interface ITemplate {
    id?: number,
    template_name: string,
    plant_id?: number,
    plant_name?: string,
    contents: number[],
    phase_start: string,
    phase_end: string,
    frequency: number | null,
    treatment_gap: number | null,
    special_condition: string,
    apply_type: string,
    type: string,
    dosage: string,
    volume: string,
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

interface IShowTemplates {
    templates: ITemplate[],
    showAddTemplate: boolean,
    newTemplate: ITemplate,
    plants: IPlant[],
    phases: string[],
    treatment_types: string[],
    treatment_apply_types: string[],
    components: IComponent[],
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
            // columns: 2,
            padding: theme.spacing(0, 5),
            margin: theme.spacing(2, 0),
            border: '2px solid black',
            display: 'grid',
            // flexDirection: 'column',
            // display: 'grid';
            gridTemplateColumns: '1fr 1fr',
            '& button': {
                marginBottom: theme.spacing(2),
                marginRight: theme.spacing(2),
                gridColumn: 'span 2',
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
        },
        itemsContainer: {
            padding: theme.spacing(0, 2),
            border: '2px solid red',
        },
        header: {
            padding: theme.spacing(2),
            gridColumn: 'span 2',
            justifySelf: 'center'
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
            justifySelf: 'center',
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
    const defaultTemplate = {
        contents: [],
        phase_start: '',
        phase_end: '',
        frequency: null,
        treatment_gap: null,
        template_name: '',
        special_condition: '',
        apply_type: '',
        type: '',
        dosage: '',
        volume: '',
    };
    const [state, setState] =  useState<IShowTemplates>({
        templates: [],
        showAddTemplate: false,
        newTemplate: { ...defaultTemplate },
        plants: [],
        phases: [],
        treatment_types: [],
        treatment_apply_types: [],
        components: [],
    })

    const getInitialData = async () => {
        const templates = await api('get', 'show-templates');
        const plants = await api('get', 'get-plants');
        const phases = await api('get', 'get-phases');
        const treatment_types = await api('get', 'get-treatment-types');
        const treatment_apply_types = await api('get', 'get-treatment-apply-types');
        const components = await api('get', 'show-components');
        console.info(175, templates)
        setState({
            ...state,
            templates,
            plants: sortBy(plants, 'plant_name'),
            phases,
            treatment_types,
            treatment_apply_types,
            components
        })
    }

    const getTemplates = async () => {
        const templates = await api('get', 'show-templates');
        setState({
            ...state,
            templates,
            newTemplate: { ...defaultTemplate }
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
        event.preventDefault();
        console.info('add template:', state.newTemplate)
        if (state.newTemplate.template_name === '') {
            window.alert('не введено имя компонента')
            return
        } else {
            try {
                const res = await axios.post(
                    `${API_URL}/add-template`,
                    {
                        ...state.newTemplate,
                        template_name: state.newTemplate.template_name.toLowerCase(),
                    }
                );
                if (res.data.error) {
                    window.alert(res.data.error)
                } else {
                    getTemplates()
                    window.alert('success')
                }
            } catch (e) {
                console.info(226, e);
            }

        }
    }
    const handleChange = (name: keyof ITemplate) => (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        console.info(175, value)
        setState({
            ...state,
            newTemplate: {
                ...state.newTemplate,
                [name]: value,
            } as ITemplate
        });
    }
    return (
        <div className={classes.root}>
            <Container>
                <Grid className={classes.formContainer}>
                    {state.showAddTemplate ?
                        <Grid className={classes.form} component="form" onSubmit={addTemplate}>
                            <Typography component="span" variant="h5" className={classes.header}>Добавить новый шаблон обработки</Typography>
                            <TextField
                                id="template-name"
                                label="Название шаблона"
                                value={state.newTemplate.template_name}
                                onChange={handleChange('template_name')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                select
                                id="select-plant"
                                label="Растение"
                                value={state.newTemplate && state.newTemplate.plant_id || 0}
                                onChange={handleChange('plant_id')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: false }}
                            >
                                {state.plants && state.plants.map((item: IPlant) => (
                                    <MenuItem key={item.id} value={item.id}>{item.plant_name}</MenuItem>
                                )) || []}
                            </TextField>
                            <TextField
                                select
                                id="select-phase"
                                label="Фаза начала"
                                value={state.newTemplate && state.newTemplate.phase_start || ''}
                                onChange={handleChange('phase_start')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: false }}
                            >
                                {state.phases && state.phases.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                )) || []}
                            </TextField>
                            <TextField
                                select
                                id="select-phase"
                                label="Фаза окончания"
                                value={state.newTemplate ? state.newTemplate.phase_end: ''}
                                onChange={handleChange('phase_end')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: false }}
                            >
                                {state.phases && state.phases.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                )) || []}
                            </TextField>
                            <TextField
                                select
                                id="select-treatment-type"
                                label="Тип обработки по назначению"
                                value={state.newTemplate ? state.newTemplate.type: ''}
                                onChange={handleChange('type')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: false }}
                            >
                                {state.treatment_types && state.treatment_types.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                )) || []}
                            </TextField>
                            <TextField
                                select
                                id="select-treatment-apply-type"
                                label="Тип обработки по способу"
                                value={state.newTemplate ? state.newTemplate.apply_type: ''}
                                onChange={handleChange('apply_type')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: false }}
                            >
                                {state.treatment_apply_types && state.treatment_apply_types.map((item: string) => (
                                    <MenuItem key={item} value={item}>{item}</MenuItem>
                                )) || []}
                            </TextField>
                            <TextField
                                select
                                id="select-contents"
                                label="Компоненты"
                                value={state.newTemplate && state.newTemplate.contents || []}
                                onChange={handleChange('contents')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                SelectProps={{ multiple: true }}
                            >
                                {state.components.length && state.components.map((item: IComponent) => (
                                    <MenuItem key={item.id} value={Number(item.id)}>{item.component_name}</MenuItem>
                                )) || []}
                            </TextField>
                            <TextField
                                id="frequency"
                                label="Кратность"
                                value={state.newTemplate && state.newTemplate.frequency || ''}
                                onChange={handleChange('frequency')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="treatment_gap"
                                label="Промежуток между обработками, дней"
                                value={state.newTemplate && state.newTemplate.treatment_gap || ''}
                                onChange={handleChange('treatment_gap')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="special_condition"
                                label="Специальные условия"
                                value={state.newTemplate && state.newTemplate.special_condition || ''}
                                onChange={handleChange('special_condition')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="dosage"
                                label="Дозировка"
                                value={state.newTemplate && state.newTemplate.dosage || ''}
                                onChange={handleChange('dosage')}
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                            />
                            <TextField
                                id="volume"
                                label="Объём??"
                                value={state.newTemplate && state.newTemplate.volume || ''}
                                onChange={handleChange('volume')}
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
                            onClick={() => setState({ ...state, showAddTemplate: true })}
                            variant="contained"
                            color="primary"
                            // type="submit"
                            // disabled={state.isLoading}
                            className={classes.addButton}
                        >
                            {/*{state.isLoading ? <CircularProgress size={14} color="secondary" /> : 'Отправить'}*/}
                            Добавить шаблон
                        </Button>
                    }
                </Grid>
                <Grid container className={classes.itemsContainer}>
                    {/*{state.templates && state.templates.length ?*/}
                    {/*    state.templates.map((c: ITemplate) => (*/}
                    {/*        <div className='component' key={c.id}>*/}
                    {/*            <div><p>'ID:'</p>{c.id}</div>*/}
                    {/*            <div><p>'Name:'</p>{c.template_name}</div>*/}
                    {/*            <div><p>'Plant:'</p>{c.plant_name}</div>*/}
                    {/*            <div><p>'Contents:'</p>{c.contents}</div>*/}
                    {/*            <div><p>'Phase begin:'</p>{c.phase_start}</div>*/}
                    {/*            <div><p>'Phase end:'</p>{c.phase_end}</div>*/}
                    {/*        </div>*/}
                    {/*        ),*/}
                    {/*    ) : 'no templates found'}*/}
                    {state.templates && state.templates.length ?
                        <MuiTable
                            data={state.templates}
                            fields={{
                                'ID': 'id',
                                'Название шаблона': 'template_name',
                                'Растение': 'plant_name',
                                'Состав': 'contents',
                                'Фаза начала': 'phase_start',
                                'Фаза конца': 'phase_end'
                            }}
                        />
                        : 'no templates found'}
                </Grid>
            </Container>
        </div>
    )
}

export default ShowTemplates
