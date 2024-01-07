import type { ToastOptions } from "$lib/interfaces/toast"
import { toast } from "@zerodevx/svelte-toast"

const defaultOpts = {
    duration: 2000,
    theme: {
        "--toastBackground": "#48BB78",
        "--toastProgressBackground": "#2F855A"
    }
}

export const triggerToastMessage = (message: string, opts?: { options?: ToastOptions}) => {
    toast.push(message, opts?.options ?? defaultOpts)
}