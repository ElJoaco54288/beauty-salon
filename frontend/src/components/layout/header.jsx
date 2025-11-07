import '../../styles/components/layout/header.css'
import { Link } from 'react-router-dom';

const Header = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <header className="topbar">
            <div className="logo">
                <Link to="/">Beauty Salon</Link>
            </div>
            
            {/* Menu hamburgesa de opciones de usuario */}
            <input type="checkbox" id="menu-toggle" />
            <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
            <nav className="nav">
                <ul>
                    <li onClick={handleLogout} style={{cursor: 'pointer'}}>Cerrar sesion</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;