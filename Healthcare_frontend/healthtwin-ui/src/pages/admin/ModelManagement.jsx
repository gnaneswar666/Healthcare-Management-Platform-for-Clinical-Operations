import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
    BrainCircuit,
    Cpu,
    RefreshCw,
    Search,
    Zap,
    X
} from "lucide-react";

import {
    getModels,
    activateModel
} from "../../services/modelService";

function ModelManagement() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    async function loadModels() {
        try {
            setLoading(true);
            const data = await getModels();
            setModels(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadModels();
    }, []);

    async function handleActivate(id) {
        if (!window.confirm("Activate this AI Model?")) return;
        try {
            await activateModel(id);
            await loadModels();
            alert("Model Activated Successfully");
        } catch (err) {
            console.log(err);
            alert("Unable to activate model");
        }
    }

    const filtered = useMemo(() => {
        return models.filter(model =>
            model.modelName?.toLowerCase().includes(search.toLowerCase())
            ||
            model.algorithm?.toLowerCase().includes(search.toLowerCase())
        );
    }, [models, search]);

    const activeModel = models.find(m => m.active);
    const avgAccuracy =
        models.length === 0
            ? 0
            : (models.reduce((a, b) => a + b.accuracy, 0) / models.length).toFixed(2);

    return (
        <AdminLayout>
            <div className="page-card">
                <div className="page-header">
                    <div className="page-header__info">
                        <div className="page-status-chip page-status-chip--violet">
                            <BrainCircuit size={14} />
                            Prediction Engine
                        </div>
                        <h1 className="page-title">AI Model Management</h1>
                        <p className="page-subtitle">Manage predictive AI models used for heart disease risk stratification and clinical decision support.</p>
                    </div>
                    <div className="page-header__actions">
                        <button
                            onClick={loadModels}
                            className="btn btn--ghost"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="grid-section md:grid-cols-3 mb-8">
                    <div className="stat-card stat-card--brand">
                        <div className="relative flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Total Models</div>
                                <div className="stat-card__value">{models.length}</div>
                                <div className="stat-card__meta">Candidate and production models</div>
                            </div>
                            <div className="stat-card__icon">
                                <Cpu size={22} />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card stat-card--emerald">
                        <div className="relative flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Active Model</div>
                                <div className="stat-card__value !text-[1.65rem] mt-4">
                                    {activeModel?.modelName || "—"}
                                </div>
                                <div className="stat-card__meta">Currently in production</div>
                            </div>
                            <div className="stat-card__icon">
                                <Zap size={22} />
                            </div>
                        </div>
                    </div>
                    <div className="stat-card stat-card--violet">
                        <div className="relative flex items-start justify-between">
                            <div>
                                <div className="stat-card__label">Avg. Accuracy</div>
                                <div className="stat-card__value">{avgAccuracy}%</div>
                                <div className="stat-card__meta">Across evaluated models</div>
                            </div>
                            <div className="stat-card__icon">
                                <BrainCircuit size={22} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative mb-6 w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                        <Search size={19} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search models by name or algorithm..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ paddingLeft: "3.1rem", paddingTop: "12px", paddingBottom: "12px" }}
                        className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50/70 pr-10 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-2xs"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg p-1 transition-all cursor-pointer"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                <div className="data-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Model Name</th>
                                <th className="text-center">Version</th>
                                <th className="text-center">Algorithm</th>
                                <th className="text-center">Accuracy</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="data-table__empty">
                                        Loading models...
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="data-table__empty">
                                        No models found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(model => (
                                    <tr key={model.id}>
                                        <td className="font-semibold text-slate-800">
                                            {model.modelName}
                                        </td>
                                        <td className="text-center">
                                            <span className="badge badge--slate">{model.version}</span>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge badge--brand">{model.algorithm}</span>
                                        </td>
                                        <td className="text-center font-semibold text-slate-800">
                                            {model.accuracy}%
                                        </td>
                                        <td className="text-center">
                                            {model.active ? (
                                                <span className="badge badge--success badge--dot">Active</span>
                                            ) : (
                                                <span className="badge badge--slate">Inactive</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {model.active ? (
                                                <button
                                                    disabled
                                                    className="btn btn--success btn--sm opacity-80 cursor-default"
                                                >
                                                    <Zap size={14} />
                                                    Active
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleActivate(model.id)}
                                                    className="btn btn--primary btn--sm"
                                                >
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default ModelManagement;
