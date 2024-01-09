import type { ToastOptions } from '$lib/interfaces/toast';
import { toast } from '@zerodevx/svelte-toast';

const defaultOpts = {
	duration: 2000,
	theme: {
		'--toastBackground': '#48BB78',
		'--toastProgressBackground': '#2F855C'
	}
};

export const triggerToastMessage = (message: string, opts?: ToastOptions ) => {
	toast.push(message, opts ?? defaultOpts);
};

export const triggerToastError = (message: string, duration = 5000) => {
	triggerToastMessage(message, {
		duration: duration,
		theme: {
			'--toastBackground': '#FF9999',
			'--toastProgressBackground': '#FFCCCC',
		}
	});
};
