import axios from 'axios'


const api = axios.create({ baseURL: 'https://rninox-b774b03b3a02.herokuapp.com/api/' },
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })


export default api
