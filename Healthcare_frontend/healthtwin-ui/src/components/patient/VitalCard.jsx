import { TrendingUp } from "lucide-react";

function VitalCard({
    title,
    value,
    unit,
    icon,
    color = "blue"
}) {

    const colors = {
        red: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-600"
        },
        blue: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-600"
        },
        green: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-600"
        },
        orange: {
            bg: "bg-orange-50",
            border: "border-orange-200",
            text: "text-orange-600"
        }
    };

    const c = colors[color];

    return (

        <div
            className={`
                ${c.bg}
                ${c.border}
                border
                rounded-2xl
                p-6
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
                cursor-pointer
            `}
        >

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500 font-medium">
                        {title}
                    </p>

                    <h1
                        className={`
                        text-4xl
                        font-bold
                        mt-3
                        ${c.text}
                    `}
                    >
                        {value ?? "--"}

                        <span className="text-xl ml-1">
                            {unit}
                        </span>

                    </h1>

                </div>

                <div
                    className={`
                        text-5xl
                        ${c.text}
                    `}
                >
                    {icon}
                </div>

            </div>

            <div className="flex items-center mt-5">

                <TrendingUp
                    size={18}
                    className={c.text}
                />

                <span
                    className={`
                    ml-2
                    text-sm
                    ${c.text}
                `}
                >
                    Live Update
                </span>

            </div>

        </div>

    );

}

export default VitalCard;