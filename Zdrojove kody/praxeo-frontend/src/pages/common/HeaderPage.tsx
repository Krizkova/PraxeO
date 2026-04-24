import React, { ReactNode } from "react";

type HeaderPageProps = {
    icon: ReactNode;
    title: string;
    subtitle?: string;
    action?: ReactNode;
};

const HeaderPage: React.FC<HeaderPageProps> = ({
                                                   icon,
                                                   title,
                                                   subtitle,
                                                   action,
                                               }) => {
    return (
        <div
            style={{
                background: "white",
                borderBottom: "1px solid #e0ede0",
                boxShadow: "0 2px 8px rgba(34,85,34,0.06)",
                padding: "20px 32px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: action ? "space-between" : "flex-start",
                    gap: 16,
                }}
            >
                {/* Levá část hlavičky: ikona, nadpis a případný podnadpis */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {icon}

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#1a3d1a",
                                letterSpacing: "-0.3px",
                            }}
                        >
                            {title}
                        </h1>

                        {/* Podnadpis vykreslujeme jen na stránkách, kde opravdu existuje */}
                        {subtitle && (
                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 13,
                                    color: "#6b8f6b",
                                    marginTop: 1,
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Pravá část je volitelná, typicky pro akční tlačítko */}
                {action && <div>{action}</div>}
            </div>
        </div>
    );
};

export default HeaderPage;