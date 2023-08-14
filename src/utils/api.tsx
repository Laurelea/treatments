import { API_URL } from '../config';
import axios from "axios";

const api = async (method: string, path: string) => {
    // console.info('api triggered:', method, path)
    if (method == 'get') {
        return await axios.get(`${API_URL}/${path}`, {})
            .then(async (response: any) => {
                // console.info(`${path} post.response.data: `, response.data);
                if (response.data) {
                    return await response.data
                } else {
                    throw new Error(`${path}: no data in response`)
                }
            })
            .catch((error: any) => {
                console.error(error);
            })
    }
}

export default api
