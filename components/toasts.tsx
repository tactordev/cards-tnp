"use client";
import { AnimatePresence, motion } from "motion/react";



export default class Toasts {
    public toasts: Toast[] = [];
    private onUpdate: () => void;

    constructor(fupdate: () => void) {
        this.onUpdate = fupdate;
    }


    send(message: string, type: "info" | "success" | "error" = "info", duration = 3000) {
        const toast = new Toast(message, type, duration);
        this.toasts.push(toast);
        
        this.onUpdate();
        const timeoutId = setTimeout(() => {
            this.remove(toast.id);
        }, duration);
    }

    remove(id: string) {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
        this.onUpdate();
    }
}

export class Toast {
    public id: string;
    public message: string;
    public type: "info" | "success" | "error";
    public duration: number;
    public timeoutId: NodeJS.Timeout | null = null;
    public intervalId: NodeJS.Timeout | null = null;

    constructor(message: string, type: "info" | "success" | "error", duration = 3000) {
        this.id = Math.random().toString(36).substring(2, 9);
        this.message = message;
        this.type = type;
        this.duration = duration;
    }
}


export function ToastsC({
    tm
}: {
    tm: Toasts | null
}) {

    return (
        <div className="flex flex-col gap-2 mt-2">
            
            <AnimatePresence>
                { tm && tm.toasts.map((toast) => (
                    <motion.li initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }} exit={{ scale: 0 }} className={
                        `flex items-center justify-between gap-4 px-3 py-2 rounded-md shadow-md text-sm font-medium border text-white
                        ${
                            toast.type === "success" ? "bg-green-600/20 border-green-500/40" : 
                            toast.type === "error" ? "bg-red-600/20 border-red-500/40" : 
                            toast.type === "info" ? "bg-blue-600/20 border-blue-500/40" : "" }
                        `}
                        key={toast.id}
                        layout>
                            <p className="text-white/40">{toast.message}</p>
                    </motion.li>
                ))
                }
            </AnimatePresence>
        </div>
    )
}

