import { toast } from 'react-toastify';

const toastHelper = (type, message) => {
    if (!toast[type]) {
        console.error(`Invalid toast type: ${type}`);
        return;
    }

    if (!message) {
        console.error("Message is required for toast notifications.");
        return;
    }
    toast[type](message, {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    })
}
export default toastHelper