function StatCard({
    title,
    value,
    subtitle,
    icon,
    variant = "brand"
}) {
    const variantClass = {
        brand: "stat-card--brand",
        emerald: "stat-card--emerald",
        violet: "stat-card--violet",
        rose: "stat-card--rose",
        amber: "stat-card--amber",
        teal: "stat-card--teal",
        slate: "stat-card--slate",
    }[variant] || "stat-card--brand";

    return (
        <div className={`stat-card ${variantClass}`}>
            <div className="relative flex items-start justify-between">
                <div>
                    <div className="stat-card__label">{title}</div>
                    <div className="stat-card__value">{value}</div>
                    {subtitle && <div className="stat-card__meta">{subtitle}</div>}
                </div>
                <div className="stat-card__icon">
                    {icon}
                </div>
            </div>
        </div>
    );
}

export default StatCard;
