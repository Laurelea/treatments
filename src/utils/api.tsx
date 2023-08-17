import { API_URL } from '../config';
import axios from "axios";

const api = async (method: string, path: string, data: any=undefined) => {
    try {
        let res;
        if (method == 'get') {
            res = await axios.get(`${API_URL}/${path}`, {});
            console.info(9, res)
        } else if (method == 'post') {
            res = await axios.post(`${API_URL}/${path}`, data);
        } else {
            throw new Error('unknown method in api')
        }
        return await res.data
    } catch (error) {
        console.error(`error ${method} ${path} ${error}`);
        throw new Error(`${path}: no data in response`)
    }
}

export default api
