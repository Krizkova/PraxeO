import React, {useEffect, useState} from "react";
import HeaderView from "../components/header/HeaderView";
import { Container, Row, Col } from "react-bootstrap";
import LoginView from "../components/login/LoginView";
import Header from "../components/header/Header";
import Cookies from "js-cookie";

const HomePage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("token"));

    useEffect(() => {
        const interval = setInterval(() => {
            const token = Cookies.get("token");
            setIsLoggedIn(!!token);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Header />

            <Container className="my-5">
                <Row className="align-items-start">
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

                    {!isLoggedIn && (
                        <Col xs={12} md={5} lg={4}>
                            <div className="p-4 border rounded shadow-sm bg-white">
                                <LoginView />
                            </div>
                        </Col>
                    )}
                </Row>
            </Container>
        </>
    );
};

export default HomePage;
