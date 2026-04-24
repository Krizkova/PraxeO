import React from "react";
import { University, ExternalLink } from "lucide-react";

// Styly footeru
const styles = {
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

const Footer: React.FC = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                {/* Levá část footeru */}
                <div style={styles.left}>
                    <div style={styles.iconBox}>
                        <University size={13} color="#1F8A4D" strokeWidth={2.2} />
                    </div>

                    <div style={styles.leftGroup}>
                        <span>Přírodovědecká fakulta, Ostravská univerzita</span>
                        <span>·</span>

                        {/* Externí odkaz */}
                        <a
                            href="https://www.osu.cz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.link}
                            aria-label="Otevřít web osu.cz v novém panelu"
                        >
                            osu.cz
                            <ExternalLink size={12} strokeWidth={2.1} />
                        </a>
                    </div>
                </div>

                {/* Pravá část footeru */}
                <div style={styles.right}>
                    Vytvořeno studenty Katedry informatiky a počítačů
                </div>
            </div>
        </footer>
    );
};

export default Footer;