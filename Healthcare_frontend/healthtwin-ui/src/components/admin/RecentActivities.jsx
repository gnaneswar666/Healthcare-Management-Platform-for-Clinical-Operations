import {
    UserPlus,
    HeartPulse,
    ShieldCheck,
    Activity,
    BrainCircuit
} from "lucide-react";

function RecentActivities({ patients, consents, vitals }) {

    const activities = [];

    patients
        .slice(-2)
        .reverse()
        .forEach(p =>

            activities.push({

                icon: <UserPlus size={20}/>,

                color: "bg-blue-100 text-blue-700",

                title: "Patient Registered",

                description: `${p.firstName} ${p.lastName}`

            })

        );

    consents
        .slice(-2)
        .reverse()
        .forEach(c =>

            activities.push({

                icon: <ShieldCheck size={20}/>,

                color: "bg-purple-100 text-purple-700",

                title: "Consent Updated",

                description: `${c.patientId}`

            })

        );

    vitals
        .slice(-2)
        .reverse()
        .forEach(v =>

            activities.push({

                icon: <HeartPulse size={20}/>,

                color: "bg-red-100 text-red-700",

                title: "Vitals Received",

                description: `${v.patientId}`

            })

        );

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">

                    Recent Activities

                </h2>

                <BrainCircuit className="text-blue-600"/>

            </div>

            <div className="space-y-5">

                {

                    activities.map((activity,index)=>(

                        <div
                            key={index}
                            className="flex items-center gap-5 border-b pb-4">

                            <div className={`p-3 rounded-full ${activity.color}`}>

                                {activity.icon}

                            </div>

                            <div>

                                <h3 className="font-semibold">

                                    {activity.title}

                                </h3>

                                <p className="text-gray-500 text-sm">

                                    {activity.description}

                                </p>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default RecentActivities;