import React from "react";
import Header from "../components/Header/Header";
import { Container, Row, Col } from "react-bootstrap";
import LoginForm from "../components/LoginForm/LoginForm";

const HomePage: React.FC = () => {
    return (
        <>
            {/* Header od kraje do kraje */}
            <Header />

            {/* Obsah stránky s vnitřním odsazením */}
            <Container className="my-5">
                <Row className="align-items-start">
                    {/* Popis projektu */}
                    <Col xs={12} md={7} lg={8} className="mb-4 mb-md-0">
                        <h1 className="mb-4">O projektu PraxeO</h1>
                        <p>
                            PraxeO je webová aplikace pro správu studentských praxí na univerzitě.
                            Umožňuje komunikaci mezi studenty, vyučujícími a externími mentory.
                        </p>
                        <ul>
                            <li>Registrovat a vybírat dostupné praxe,</li>
                            <li>Zadávat praxe nebo vybírat si vlastní,</li>
                            <li>Řešit úkoly a přidávat komentáře či soubory,</li>
                            <li>Sledovat průběh a vyhodnocení praxe.</li>
                        </ul>
                        <p>
                            Projekt je tvořen moderní architekturou{" "}
                            <strong>Spring Boot (backend)</strong> a{" "}
                            <strong>React (frontend)</strong>, napojenou na databázi PostgreSQL.
                        </p>
                    </Col>

                    {/* Login panel */}
                    <Col xs={12} md={5} lg={4}>
                        <div className="p-4 border rounded shadow-sm bg-white">
                            <LoginForm />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default HomePage;
