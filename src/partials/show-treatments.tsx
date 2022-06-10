import '../App.css';
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { API_URL } from "../config";

interface ITreatment {
    id: number,
    date_start: string,
    status: string,
    period_started: boolean,
    period_ended: boolean,
    dates_to_do: Array<string> | undefined,
    dates_done: Array<string> | undefined,
    number_done: number,
    date_create: string,
    plant: string,
    type: string,
    purpose: string,
    components: Array<string>
    phase_start: string,
    phase_end: string,
    frequency: number,
    treatment_gap: number | null,
    special_condition: string,
}

interface IShowTreatments {
    treatments: Array<ITreatment> | undefined,
}

export const ShowTreatments =  () => {
    console.info('ShowTreatments')
    const [state, setState] =  useState<IShowTreatments>({
        treatments: undefined
    })
    useEffect(() => {
        axios.get(`${API_URL}/show-treatments`, {})
            .then(response => {
                console.info("show-treatments post.response.data: ", response.data);
                if (response.data) {
                    setState({
                        ...state,
                        treatments: response.data
                    });
                }
                // return response.data.message
            })
            // .then(message => {
            //     window.alert(message)
            // })
            .catch(error => {
                console.error(error);
            })
    }, [])
    return (
        <div className='mainElement'>
            {state.treatments ?
                state.treatments.map((c: ITreatment) => (
                        <div className='component' key={c.id}>
                            <div><p>'ID:'</p>{c.id}</div>
                            <div><p>'Plant:'</p>{c.plant}</div>
                            <div><p>'Contents:'</p>{c.components.join(', ')}</div>
                        </div>
                    ),
                ) : 'no components found'}
        </div>
        // <React.Fragment>
        //
        // </React.Fragment>
    )
}

