import React from "react";
import { Navbar, Row, Col } from "react-bootstrap";

const Header: React.FC = () => {
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

                {/* Volitelný prostor vpravo */}
                <Col className="d-none d-lg-flex justify-content-end me-3">
                    {/* Např. tlačítko Odhlásit nebo uživatelské menu */}
                </Col>
            </Row>
        </Navbar>
    );
};

export default Header;
