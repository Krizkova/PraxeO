import React, { ReactNode } from "react";

type IconBadgePageProps = {
    children: ReactNode;
    variant?: "green" | "orange";
};

const IconBadgePage: React.FC<IconBadgePageProps> = ({
                                                         children,
                                                         variant = "green",
                                                     }) => {
    const background =
        variant === "orange"
            ? "linear-gradient(135deg, #e67e22, #f39c12)"
            : "linear-gradient(135deg, #2d7a2d, #4caf50)";

    const boxShadow =
        variant === "orange"
            ? "0 4px 12px rgba(230,126,34,0.3)"
            : "0 4px 12px rgba(45,122,45,0.3)";

    return (
        <div
            style={{
                width: 44,
                height: 44,
                background,
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow,
                flexShrink: 0,
                transition: "all 0.3s",
            }}
        >
            {/* Sdílený obal pro ikony v hlavičkách stránek; barva se může měnit podle režimu */}
            {children}
        </div>
    );
};

export default IconBadgePage;