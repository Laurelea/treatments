import '../App.css';
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { API_URL } from "../config";

interface IComponent {
    id: number,
    name: string,
    substance: string,
}

interface IShowComponents {
    components: Array<IComponent> | undefined,
}

export const ShowComponents =  async () => {
    const [state, setState] =  useState<IShowComponents>({
        components: undefined
    })
    useEffect(() => {
        axios.post(`${API_URL}/show-components`, {})
            .then(response => {
                console.info("show-components post.response.data: ", response.data);
                if (response.data.success) {
                    setState({
                        ...state,
                        components: response.data
                    });
                }
                return response.data.message
            })
            .then(message => {
                window.alert(message)
            })
            .catch(error => {
                console.error(error);
            })
    }, [])

    return (
        <div className='mainElement'>
            {state.components ?
                state.components.map((c: IComponent) => (
                        <div className='component'>
                            <div><p>'ID:'</p>{c.id}</div>
                            <div><p>'Name:'</p>{c.name}</div>
                            <div><p>'Substance:'</p>{c.substance}</div>
                        </div>
                    ),
                ) : 'no components found'}
        </div>
    )
}

