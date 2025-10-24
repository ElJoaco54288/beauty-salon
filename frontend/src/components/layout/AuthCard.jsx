// contenedor de tarjeta de signin/signup
import '../../styles/components/layout/auth.css'

const AuthCard = ({ title, children, subtitle }) => {
  return (
    <div className="auth-card">
      <h2 className="auth-title">{title}</h2>
      {subtitle && <p className="auth-subtitle">{subtitle}</p>}
      <div className="auth-content">{children}</div>
    </div>
  );
}

export default AuthCard;