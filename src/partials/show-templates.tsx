import '../App.css';
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { Grid, Button, TextField, Typography, MenuItem } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import api from "src/utils/api";
import { IComponent, ITemplate } from "src/utils/types";
import MuiTable from "src/components/MuiTable";
import { sortBy } from "src/utils/utils";


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
            phases: phases.sort(),
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
                const res = await api('post', 'add-template', {
                    ...state.newTemplate,
                    template_name: state.newTemplate.template_name.toLowerCase(),
                })
                if (!res.success) {
                    window.alert(res.message)
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
            <Grid item container xs={12}>
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
                                required
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
                                required
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
                                required
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
                                required
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
                    {state.templates && state.templates.length ?
                        <MuiTable
                            data={state.templates}
                            fields={{
                                'ID': 'id',
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
                                'Спец.условие': 'special_condition'
                            }}
                        />
                        : 'no templates found'}
                </Grid>
            </Grid>
        </div>
    )
}

export default ShowTemplates
