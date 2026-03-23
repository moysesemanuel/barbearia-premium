import styles from "./page.module.css";

const services = [
  { name: "Corte classico", price: "R$ 45", duration: "45 min" },
  { name: "Barba completa", price: "R$ 35", duration: "30 min" },
  { name: "Combo premium", price: "R$ 70", duration: "75 min" },
];

const gallery = [
  "Ambiente sofisticado",
  "Detalhes do acabamento",
  "Experiencia completa",
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>Prime Cut Studio</span>
        <nav className={styles.nav}>
          <a href="#servicos">Servicos</a>
          <a href="#galeria">Galeria</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.kicker}>Barbearia contemporanea</p>
            <h1>Presenca forte, agenda organizada e experiencia premium.</h1>
            <p className={styles.description}>
              Projeto inicial para uma barbearia com pagina institucional,
              apresentacao de servicos e base pronta para agendamento online com
              horarios atualizados automaticamente.
            </p>
            <div className={styles.ctas}>
              <a className={styles.primary} href="#agendamento">
                Agendar horario
              </a>
              <a className={styles.secondary} href="#servicos">
                Ver servicos
              </a>
            </div>
          </div>

          <aside className={styles.scheduleCard} id="agendamento">
            <span className={styles.cardLabel}>Proxima etapa do sistema</span>
            <h2>Fluxo de agendamento</h2>
            <ul className={styles.scheduleList}>
              <li>Escolha do servico</li>
              <li>Selecao do barbeiro</li>
              <li>Consulta de horarios livres</li>
              <li>Confirmacao automatica no banco</li>
            </ul>
            <p className={styles.cardNote}>
              Esta base sera conectada com PostgreSQL e Prisma nas proximas
              etapas.
            </p>
          </aside>
        </section>

        <section className={styles.section} id="servicos">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>Servicos em destaque</p>
            <h2>Estrutura pronta para virar catalogo real.</h2>
          </div>

          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <article className={styles.serviceCard} key={service.name}>
                <div className={styles.serviceTop}>
                  <h3>{service.name}</h3>
                  <span>{service.price}</span>
                </div>
                <p>Atendimento pensado para encaixar no fluxo do agendamento.</p>
                <strong>{service.duration}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} id="galeria">
          <div className={styles.sectionHeading}>
            <p className={styles.sectionEyebrow}>Galeria conceitual</p>
            <h2>Blocos visuais para evoluir depois para carrossel.</h2>
          </div>

          <div className={styles.galleryGrid}>
            {gallery.map((item, index) => (
              <article className={styles.galleryCard} key={item}>
                <span>0{index + 1}</span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.contactSection} id="contato">
          <div>
            <p className={styles.sectionEyebrow}>Contato</p>
            <h2>Pronto para virar um case forte no GitHub e no LinkedIn.</h2>
          </div>
          <div className={styles.contactCard}>
            <p>Rua Exemplo, 123 - Centro</p>
            <p>(11) 99999-9999</p>
            <p>contato@primecutstudio.com</p>
          </div>
        </section>
      </main>
    </div>
  );
}
