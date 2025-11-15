import React from "react";
import { Navbar, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface HeaderViewProps {
    email?: string;
    role?: string;
    onLogout?: () => void;
    onAddUser?: () => void;
}

const HeaderView: React.FC<HeaderViewProps> = ({ email, role, onLogout, onAddUser }) => {
    const navigate = useNavigate();
    const canAddUser = role === "ADMIN" || role === "TEACHER";

    return (
        <Navbar bg="success" variant="dark" expand="lg" className="shadow-sm py-2">
            <Row className="w-100 m-0 align-items-center">
                <Col xs="auto" className="d-flex align-items-center ms-3">
                    <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTenJ6soGRThFsEiLSHM3ljqVMSQdUWkYsY_Q&s"
                            alt="PraxeO logo"
                            width="36"
                            height="36"
                            className="d-inline-block align-top"
                        />
                        <span className="fw-bold fs-4">PraxeO</span>
                    </Navbar.Brand>
                </Col>

                <Col className="d-flex justify-content-end align-items-center me-3">
                    {email && (
                        <>
                            <Button
                                variant="outline-light"
                                size="sm"
                                className="fw-semibold me-3"
                                onClick={() => navigate("/summary")}
                            >
                                Přehled praxí
                            </Button>
                            {canAddUser && (
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="fw-semibold me-3"
                                    onClick={onAddUser}
                                >
                                    Přidat uživatele
                                </Button>
                            )}
                            <span className="text-light me-3 fw-semibold">{email}</span>
                            <Button
                                variant="outline-light"
                                size="sm"
                                className="fw-semibold"
                                onClick={onLogout}
                            >
                                Odhlásit
                            </Button>
                        </>
                    )}
                </Col>
            </Row>
        </Navbar>
    );
};

export default HeaderView;
