import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, X } from "lucide-react";

function DeletePatientModal({
    open,
    onClose,
    onDelete,
    patientName
}) {
    if (!open) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative z-10 bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100"
                >
                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-5 shadow-sm">
                            <AlertTriangle size={32} />
                        </div>

                        <h2 className="text-xl font-extrabold text-slate-900">
                            Delete Patient Record
                        </h2>

                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                            Are you sure you want to delete {patientName ? <strong className="text-slate-800">{patientName}</strong> : "this patient"}? This action cannot be undone and will permanently remove their Digital Twin record.
                        </p>

                        <div className="flex items-center justify-end gap-3 w-full mt-8">
                            <button
                                onClick={onClose}
                                className="btn btn--ghost flex-1 justify-center"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={onDelete}
                                className="btn btn--danger flex-1 justify-center"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

export default DeletePatientModal;