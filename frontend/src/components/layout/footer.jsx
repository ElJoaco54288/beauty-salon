import "../../styles/components/layout/footer.css";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
     <footer className="footer" id="footer">
        <div className="wrap-footer">
            <div className="text-element-footer element-footer">
                <h3> ¿Quienes somos? </h3>
                <p>
                    Somos una familia con raíces diversas, unidas por la pasión por la belleza. En nuestro salón, cada estilo refleja una historia, cada cuidado es un gesto de amor. Celebramos la autenticidad, las tradiciones y el arte de hacerte sentir como en casa. ¡Bienvenida a tu espacio de belleza!
                </p>
            </div>
            <div className="text-element-footer element-footer">
                <h5> Más Información </h5>
                <ul>
                    <li> Florencio Varela, Batalla de Maipu 512 </li>
                    <li> <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1700.2815997901678!2d-68.52082740059639!3d-31.53615479406842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x96816a8344d5f5e5%3A0x4f7700fdda337455!2sRivadavia%20456%2C%20J5402DEJ%20San%20Juan!5e0!3m2!1ses-419!2sar!4v1718326772106!5m2!1ses-419!2sar"
                            width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe><iframe
                            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d328.39578730791345!2d-68.51959898243581!3d-31.536456050964883!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sRivadavia%20456%20J5402DEJ%20San%20Juan!5e0!3m2!1ses-419!2sar!4v1718326863597!5m2!1ses-419!2sar"
                            width="600" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"></iframe> </li>
                </ul>
            </div>
            <div className="rrss-element-footer element-footer">
                <h5> Redes Sociales </h5>
                <ul>
                    <li><a href="https://facebook.com"><img src="/face.png" alt="" /></a></li>
                    <li><a href="https://tiktok.com"><img src="/tik-tok.png" alt="" /></a></li>
                    <li><a href="#"><img src="/wsp.png" alt="" /></a></li>
                    <li><a href="https://instagram.com"><img src="/insta.png" alt="" /></a></li>
                </ul>
            </div>
        </div>
        <div className="footer-creds">

            <p>© 2025 • Todos los derechos reservados.</p>

            <div className="legal-creds">
                <ul>
                    <li><a href="#"> Politica de Privacidad </a></li>
                    <li><a href="#"> Politica de Cookies</a></li>
                    <li><a href="#"> Aviso Legal</a></li>
                </ul>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
