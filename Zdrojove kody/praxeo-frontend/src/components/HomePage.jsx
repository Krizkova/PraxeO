import "../styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomePage() {
    return (
        <>

            <header className="bg-success text-white py-3 px-4 d-flex align-items-center">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTenJ6soGRThFsEiLSHM3ljqVMSQdUWkYsY_Q&s"
                    alt="PraxeO logo"
                    className="me-3"
                    style={{ height: "45px", borderRadius: "5px" }}
                />
                <h1 className="h3 fw-bold m-0">PraxeO</h1>
            </header>

            <div className="container my-5">
                <div className="row align-items-start">
                    <div className="col-md-7">
                        <h5 className="mb-3">📁 O projektu PraxeO</h5>
                        <p>
                            PraxeO je webová aplikace pro správu studentských praxí na univerzitě.
                            Umožňuje komunikaci mezi studenty, vyučujícími a externími mentory,
                            kteří se podílejí na vedení praxí.
                        </p>
                        <p>
                            Aplikace zjednodušuje celý proces od přihlašování na praxi až po
                            hodnocení výsledků. Uživatelé se mohou:
                        </p>
                        <ul>
                            <li>🧑‍🎓 registrovat a vybírat dostupné praxe,</li>
                            <li>🏢 zadávat praxe nebo vybírat si vlastní,</li>
                            <li>📄 řešit úkoly a přidávat komentáře či soubory,</li>
                            <li>📊 sledovat průběh a vyhodnocení praxe.</li>
                        </ul>
                        <p>
                            Projekt je tvořen moderní architekturou
                            <b> Spring Boot (backend)</b> a <b>React (frontend)</b>, napojenou na databázi PostgreSQL.
                        </p>
                    </div>
                    <div className="col-md-1">
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h5 className="card-title fw-bold mb-3">Přihlášení</h5>
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label">Jméno</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Zadej jméno"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Heslo</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Zadej heslo"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-success w-100 mb-2">
                                        Přihlásit se
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-outline-success w-100"
                                        onClick={() => (window.location.href = "/registerStudent")}
                                    >
                                        Registrovat se
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
