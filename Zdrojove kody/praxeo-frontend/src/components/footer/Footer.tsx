import React from "react";
import { University, ExternalLink } from "lucide-react";

const Footer: React.FC = () => {
    const s = {
        footer: {
            marginTop: "auto",
            borderTop: "1px solid #E6ECE6",
            background: "#F8FBF8",
        } as React.CSSProperties,

        inner: {
            maxWidth: 1280,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
        } as React.CSSProperties,

        left: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
            fontSize: 13,
            color: "#667085",
        } as React.CSSProperties,

        leftGroup: {
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
        } as React.CSSProperties,

        right: {
            fontSize: 13,
            color: "#667085",
            textAlign: "right",
        } as React.CSSProperties,

        link: {
            fontSize: 13,
            color: "#2d7a2d",
            textDecoration: "none",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
        } as React.CSSProperties,

        iconBox: {
            width: 22,
            height: 22,
            background: "#D6EDDF",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
        } as React.CSSProperties,
    };

    return (
        <footer style={s.footer}>
            <div style={s.inner}>
                <div style={s.left}>
                    <div style={s.iconBox}>
                        <University size={13} color="#1F8A4D" strokeWidth={2.2} />
                    </div>

                    <div style={s.leftGroup}>
                        <span>Přírodovědecká fakulta, Ostravská univerzita</span>
                        <span>·</span>
                        <a
                            href="https://www.osu.cz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={s.link}
                            aria-label="Otevřít web osu.cz v novém panelu"
                        >
                            osu.cz
                            <ExternalLink size={12} strokeWidth={2.1} />
                        </a>
                    </div>
                </div>

                <div style={s.right}>
                    Vytvořeno studenty Katedry informatiky a počítačů
                </div>
            </div>
        </footer>
    );
};

export default Footer;