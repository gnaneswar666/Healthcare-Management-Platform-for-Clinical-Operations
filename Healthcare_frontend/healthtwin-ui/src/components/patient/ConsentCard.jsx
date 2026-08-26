import {
  ShieldCheck,
  Calendar,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-slate-100">

      <span className="text-slate-500 font-medium">
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value}
      </span>

    </div>
  );
}

export default function ConsentCard({ consent }) {

  if (!consent) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 h-full">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

            <ShieldCheck className="w-9 h-9 text-green-600"/>

          </div>

          <div>

            <h2 className="text-4xl font-bold text-slate-900">
              Consent
            </h2>

            <p className="text-lg text-slate-500">
              Patient Permission Details
            </p>

          </div>

        </div>

        <div className="flex justify-center items-center h-60 text-slate-400 text-lg">

          No Consent Available

        </div>

      </div>
    );
  }

  const status = consent.status || "UNKNOWN";

  let badgeColor = "bg-slate-100 text-slate-700";
  let badgeIcon = <AlertCircle className="w-5 h-5"/>;

  if (status === "GRANTED") {
    badgeColor = "bg-green-100 text-green-700";
    badgeIcon = <CheckCircle2 className="w-5 h-5"/>;
  }

  if (status === "REVOKED") {
    badgeColor = "bg-red-100 text-red-700";
    badgeIcon = <XCircle className="w-5 h-5"/>;
  }

  return (

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-7 h-full">

      {/* Header */}

      <div className="flex items-center gap-4 mb-8">

        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center">

          <ShieldCheck className="w-9 h-9 text-green-600"/>

        </div>

        <div>

          <h2 className="text-4xl font-bold text-slate-900">
            Consent
          </h2>

          <p className="text-lg text-slate-500">
            Patient Permission Details
          </p>

        </div>

      </div>

      {/* Status */}

      <div className="mb-8">

        <div className="text-sm text-slate-500 mb-2">
          Current Status
        </div>

        <div
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold ${badgeColor}`}
        >
          {badgeIcon}
          {status}
        </div>

      </div>

      {/* Details */}

      <InfoRow
        label="Consent Type"
        value={consent.consentType}
      />

      <InfoRow
        label="Granted Date"
        value={new Date(consent.grantedAt).toLocaleString()}
      />

      <InfoRow
        label="Expiry Date"
        value={new Date(consent.expiryDate).toLocaleString()}
      />

      {/* Footer */}

      <div className="mt-8 bg-slate-50 rounded-2xl p-5">

        <div className="flex items-center gap-3">

          <Calendar className="text-green-600"/>

          <div>

            <p className="text-sm text-slate-500">
              Permission Active Until
            </p>

            <p className="font-semibold text-slate-800">
              {new Date(consent.expiryDate).toDateString()}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}