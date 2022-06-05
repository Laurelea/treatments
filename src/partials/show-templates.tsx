import '../App.css';
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { API_URL } from "../config";

interface ITemplate {
    id: number,
    plant: string,
    purpose: string,
    contents: Array<string>,
    phase_begin: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number | null,
    special_condition: string | null,
    type: string,
}

interface IShowTemplates {
    templates: Array<ITemplate> | undefined,
}

const ShowTemplates = () => {
    const [state, setState] =  useState<IShowTemplates>({
        templates: undefined
    })
    useEffect(() => {
        axios.get(`${API_URL}/show-templates`, {})
            .then(response => {
                console.info("show-treatments post.response.data: ", response.data);
                if (response.data) {
                    setState({
                        ...state,
                        templates: response.data
                    });
                }
            })
            .catch(error => {
                console.error(error);
            })
    }, [])
    return (
        <div className='mainElement'>
            {state.templates ?
                state.templates.map((c: ITemplate) => (
                        <div className='component' key={c.id}>
                            <div><p>'ID:'</p>{c.id}</div>
                            <div><p>'Plant:'</p>{c.plant}</div>
                            <div><p>'Contents:'</p>{c.contents}</div>
                            <div><p>'Phase begin:'</p>{c.phase_begin}</div>
                            <div><p>'Phase end:'</p>{c.phase_end}</div>
                        </div>
                    ),
                ) : 'no components found'}
        </div>
    )
}

export default ShowTemplates
