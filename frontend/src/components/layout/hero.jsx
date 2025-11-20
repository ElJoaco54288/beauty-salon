import "../../styles/components/layout/hero.css";

const Hero = () => {
    return (
        <section className="container">
            <video autoPlay loop muted playsInline className="background-clip">
                <source src="/hero.mp4" type="video/mp4" />
            </video>    

            <div className="content">
                <h1 id="texto"> Belleza y michi cuidado a tu alcance! consulta nuestros michi trabajadores, disfruta de sus cautivadoras apariencias 😺</h1>
                    
                <a href="#catalogo"> Ver ahora! </a>
            </div>
        </section> 

    );
}

export default Hero;