import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./Login";

const LoginView: React.FC = () => {
    const { email, setEmail, password, setPassword, handleLogin } = useLogin();
    const navigate = useNavigate();

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title>Přihlášení</Card.Title>

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="např. jan.pavel@osu.cz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Heslo</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Text
                        role="button"
                        className="text-secondary mb-3"
                        onClick={() => navigate("/forgot-password")}
                        style={{ cursor: "pointer" }}
                    >
                        Zapomněl jsem heslo?
                    </Form.Text>

                    <Button variant="success" type="submit" className="w-100">
                        Přihlásit se
                    </Button>

                    <Button
                        variant="outline-success"
                        className="w-100 mt-2"
                        onClick={() => navigate("/registerStudent")}
                    >
                        Registrovat se
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default LoginView;
