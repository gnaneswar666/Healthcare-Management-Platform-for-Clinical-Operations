import {
    User,
    BadgeCheck,
    Mail,
    Phone,
    MapPin,
    IdCard
} from "lucide-react";
function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex gap-4 py-4 border-b border-slate-100 last:border-0">

            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                <Icon size={18} className="text-blue-600" />

            </div>

            <div className="flex-1">

                <p className="text-sm text-slate-500">
                    {label}
                </p>

                <p className="text-base font-semibold text-slate-800 break-all">
                    {value || "--"}
                </p>

            </div>

        </div>
    );
}

function ProfileCard({ patient }) {

    return (

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">

            {/* Header */}

            <div className="mb-6">

                <h2 className="text-2xl font-bold text-slate-800">
                    Patient Profile
                </h2>

                <p className="text-slate-500">
                    Personal Information
                </p>

            </div>

            {/* Name */}

            <div className="flex items-center gap-4 mb-8">

                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">

                    <User
                        size={34}
                        className="text-blue-600"
                    />

                </div>

                <div>

                    <h3 className="text-xl font-bold text-slate-800">
                        {patient?.name}
                    </h3>

                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">

                        <BadgeCheck size={16} />

                        Active Patient

                    </div>

                </div>

            </div>

            {/* Details */}

            <div className="space-y-1">

                <DetailRow
                    icon={IdCard}
                    label="Patient ID"
                    value={patient?.patientId}
                />

                <DetailRow
                    icon={User}
                    label="Gender"
                    value={patient?.gender}
                />

                <DetailRow
                    icon={Mail}
                    label="Email"
                    value={patient?.email}
                />

                <DetailRow
                    icon={Phone}
                    label="Phone"
                    value={patient?.phone}
                />

                <DetailRow
                    icon={MapPin}
                    label="Address"
                    value={patient?.address}
                />

            </div>

        </div>

    );

}

export default ProfileCard;