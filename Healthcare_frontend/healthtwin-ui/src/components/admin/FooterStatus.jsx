import {
    CircleCheckBig,
    Database,
    Wifi,
    ShieldCheck
} from "lucide-react";

function FooterStatus() {

    return (

<footer className="bg-slate-900 text-white px-8 py-4 border-t">
            <div className="flex justify-between items-center">

                <div>

                    <h3 className="font-semibold">

                        System Status

                    </h3>

                    <p className="text-green-400 flex items-center gap-2 mt-1">

                        <CircleCheckBig size={18}/>

                        All Services Online

                    </p>

                </div>

                <div className="flex gap-10 text-sm">

                    <div className="flex items-center gap-2">

                        <Database size={18}/>

                        MongoDB

                    </div>

                    <div className="flex items-center gap-2">

                        <ShieldCheck size={18}/>

                        Keycloak

                    </div>

                    <div className="flex items-center gap-2">

                        <Wifi size={18}/>

                        Kafka

                    </div>

                </div>

            </div>

        </footer>

    );

}

export default FooterStatus;