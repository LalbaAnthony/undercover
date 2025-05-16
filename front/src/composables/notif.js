import { useToast } from 'vue-toastification';

const toast = useToast();

const MAX_NOTIFICATIONS = 2;

let activeNotifications = 0;

function notify(message, type = 'info') {
    if (!['info', 'success', 'error', 'warning'].includes(type)) {
        type = 'info';
        console.error('Invalid type for notification. Defaulting to info.');
    }

    if (activeNotifications >= MAX_NOTIFICATIONS) {
        console.warn('Max notifications reached. Ignoring new toast.');
        return;
    }

    activeNotifications++;

    const toastId = toast?.[type](message, {
        position: 'top-right',
        timeout: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.3,
        showCloseButtonOnHover: false,
        hideProgressBar: true,
        closeButton: 'button',
        icon: false,
        rtl: false,
        onClose: () => {
            activeNotifications--;
        }
    });

    return toastId;
}

function clear() {
    toast.clear();
    activeNotifications = 0;
}

export const notif = {
    notify,
    clear
};
