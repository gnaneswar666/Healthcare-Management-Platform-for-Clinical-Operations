import {
  Stethoscope,
  ShieldAlert,
  HeartPulse,
  Pill
} from "lucide-react";
function MedicalSection({
  title,
  icon,
  color,
  items
}) {
  return (

    <div className="py-6 px-4">

      {/* Header */}

      <div className="flex items-center gap-4 pl-2 mb-5">

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${color}`}
        >
          {icon}
        </div>

        <h3 className="text-xl font-semibold text-slate-800">
          {title}
        </h3>

      </div>

      {/* Content */}

      {items && items.length > 0 ? (

        <div className="flex flex-wrap gap-3 ml-16">

          {items.map((item, index) => (

            <span
              key={index}
              className="px-4 py-2
                         rounded-full
                         bg-slate-100
                         border border-slate-200
                         text-slate-700
                         font-medium
                         shadow-sm
                         hover:bg-blue-50
                         hover:border-blue-200
                         hover:text-blue-700
                         transition-all duration-300"
            >
              {item}
            </span>

          ))}

        </div>

      ) : (

        <div className="ml-16 text-slate-400 italic">
          None Reported
        </div>

      )}

    </div>

  );
}

export default function MedicalCard({ healthTwin }) {

  return (

<div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-8 py-7 h-full">      {/* Header */}

      <div className="flex items-center gap-4 mb-6">

        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">

          <Stethoscope className="w-9 h-9 text-red-600"/>

        </div>

        <div>

          <h2 className="text-4xl font-bold text-slate-900">
            Medical Details
          </h2>

          <p className="text-lg text-slate-500">
            Clinical Information
          </p>

        </div>

      </div>

      <MedicalSection

        title="Allergies"

        color="bg-orange-100"

        icon={
          <ShieldAlert className="w-6 h-6 text-orange-600"/>
        }

        items={healthTwin?.allergies}

      />

      <hr className="border-slate-200"/>

      <MedicalSection

        title="Chronic Diseases"

        color="bg-red-100"

        icon={
          <HeartPulse className="w-6 h-6 text-red-600"/>
        }

        items={healthTwin?.chronicDiseases}

      />

      <hr className="border-slate-200"/>

      <MedicalSection

        title="Current Medications"

        color="bg-blue-100"

        icon={
          <Pill className="w-6 h-6 text-blue-600"/>
        }

        items={healthTwin?.currentMedications}

      />

    </div>

  );

}