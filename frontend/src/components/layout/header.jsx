import '../../styles/components/layout/header.css'
import { Link, useNavigate } from 'react-router-dom';
import HamburgerMenu from './hamburguesa.jsx';

const Header = () => {

  return (
    <header className="topbar">
      <div className="logo">
        <Link className='linklogo' to="/inicio"><img src="/logo.jpg" alt="Logo" /></Link>
      </div>

      <HamburgerMenu />

    </header>
  );
}

export default Header;
