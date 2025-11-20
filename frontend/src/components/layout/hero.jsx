import "../../styles/components/layout/hero.css";

const Hero = () => {
    return (
        <section className="container">
            <video autoPlay loop muted playsInline className="background-clip">
                <source src="/videotiburon.mp4" type="video/mp4" />
            </video>    

            <div className="content">
                <h1 id="texto">" Bienvenido a HolyShop! Consigue productos de VTubers, voces exclusivas, ilustraciones y más."</h1>
                <a href="#catalogo"> Ver ahora! </a>
            </div>
        </section> 

    );
}

export default Hero;