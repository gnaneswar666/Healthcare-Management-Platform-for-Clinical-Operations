import { Search, X } from "lucide-react";

function PatientSearch({ search, setSearch }) {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 pointer-events-none">
                <Search size={19} className="text-slate-400" />
            </div>
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient by ID, Name, or Blood Group..."
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
    );
}

export default PatientSearch;