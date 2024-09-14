import { useToast } from 'vue-toastification'; 
import { isMobile } from '@/helpers/helpers.js'

const toast = useToast();

export function notify(message, type = 'info') {
    toast[type](message, {
        position: isMobile() ? 'top-right' : 'bottom-right',
        timeout: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: true,
        rtl: false
    });
}

export function clearNotify() {
    toast.clear();
}