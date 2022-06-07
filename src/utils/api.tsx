import { API_URL } from '../config';
import axios from "axios";
import { IDictionary } from "src/utils/types";

const api = async (method: string, path: string, data?: IDictionary<any>) => {
    console.info('api triggered:', method, path)
    if (method == 'get') {
        return await axios.get(`${API_URL}/${path}`, {})
            .then( async response => {
                console.info(`${path} post.response.data: `, response.data);
                if (response.data) {
                    return await response.data
                } else {
                    throw new Error(`${path}: no data in response`)
                }
            })
            .catch(error => {
                console.error(error);
            })
    } else if (method == 'post') {
        return await axios.post(`${API_URL}/${path}`, data)
            .then(async response => {
                return await response.data
            })
            .catch(error => {
                console.error(error);
                return { success: false, message: error }
            })
    }
}

export default  api
