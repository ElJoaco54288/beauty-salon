import '../../styles/components/layout/header.css'
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="topbar">
            <div className="brand">MiEstetica</div>
            <nav className="nav">
                <Link to="/signin" className="nav-link">Iniciar sesión</Link>
                <Link to="/signup" className="nav-link">Registro</Link>
            </nav>
        </header>
    )
}

export default Header;