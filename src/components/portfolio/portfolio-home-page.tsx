"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./portfolio-home-page.module.css";

const INSTAGRAM_URL = "https://instagram.com/";

const services = [
  {
    title: "Sites institucionais com direção visual",
    description:
      "Páginas comerciais com narrativa clara, presença de marca e estrutura preparada para crescimento.",
  },
  {
    title: "Sistemas internos e produtos web",
    description:
      "Painéis administrativos, fluxos operacionais e aplicações web pensadas para uso real, com foco em clareza, manutenção e evolução.",
  },
  {
    title: "Base técnica e continuidade",
    description:
      "Frontend, backend, banco de dados, autenticação e deploy organizados para garantir estabilidade e evolução contínua.",
  },
] as const;

const projects = [
  {
    eyebrow: "Cliente",
    title: "Plataforma para barbearia premium",
    description:
      "Projeto com presença institucional forte e operação completa por trás, reunindo agenda, fidelidade, catálogo, carrinho e backoffice integrado.",
    meta: ["Agendamento online", "Área do cliente", "Backoffice", "Gestão de estoque"],
    href: "/portfolio/barbearia",
    imageSrc: "/img/localhost_3001_admin_agenda.png",
    imageAlt: "Tela do painel administrativo da barbearia",
    imageWidth: 3456,
    imageHeight: 11084,
    scopeTitle: "Escopo entregue",
    scopeDescription:
      "Interface pública, persistência em banco, autenticação, agenda, fidelidade, catálogo de produtos, estoque e rotina administrativa conectada à operação do negócio.",
  },
  {
    eyebrow: "Produto",
    title: "Sistema de vendas com landing page comercial",
    description:
      "Conceito de SaaS com página comercial, funil, indicadores e apresentação pensada para reforçar posicionamento e conversão.",
    meta: ["CRM comercial", "Funil de vendas", "Relatórios", "Landing page"],
    href: "/portfolio/sistema-vendas",
    imageSrc: "/img/portfolio-sales-system-preview.svg",
    imageAlt: "Preview da landing page do sistema de vendas",
    imageWidth: 1200,
    imageHeight: 720,
    scopeTitle: "Escopo proposto",
    scopeDescription:
      "Aplicação standalone em `projects/sales-system`, com Prisma próprio, cadastros reais, vendas, estoque e financeiro desacoplados da barbearia.",
  },
  {
    eyebrow: "Produto",
    title: "Sistema de chamados com operação cliente e técnico",
    description:
      "Help desk com Kanban, fluxo de atendimento, comentários, status e interfaces separadas para cliente e equipe técnica.",
    meta: ["Help desk", "Kanban", "Atendimento", "Portal técnico"],
    href: "/portfolio/sistema-chamados",
    imageSrc: "/img/portfolio-support-tickets-preview.svg",
    imageAlt: "Preview do sistema de chamados",
    imageWidth: 1400,
    imageHeight: 900,
    scopeTitle: "Escopo entregue",
    scopeDescription:
      "Aplicação standalone em `separated-repos/support-tickets-app`, com backend próprio, gestão de tickets, fluxo de resposta e interface operacional inspirada em centrais de atendimento.",
  },
] as const;

const highlights = [
  { label: "Entrega", value: "Web + sistema" },
  { label: "Base", value: "Full Stack" },
  { label: "Deploy", value: "Pronto para produção (Vercel-ready)" },
] as const;

function InstagramIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <rect height="16" rx="4.5" stroke="currentColor" strokeWidth="1.8" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" fill="currentColor" r="1.1" />
    </svg>
  );
}

export function PortfolioHomePage() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState("#servicos");
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isPageReady, setIsPageReady] = useState(false);
  const featuredProject = projects[0];
  const activeProject = projects[activeProjectIndex];

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    const page = pageRef.current;

    if (!page) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");

    if (mediaQuery.matches) {
      page.style.setProperty("--spotlight-opacity", "0");
      return;
    }

    let rafId = 0;

    const updateSpotlight = (event: PointerEvent) => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(() => {
        page.style.setProperty("--spotlight-x", `${event.clientX}px`);
        page.style.setProperty("--spotlight-y", `${event.clientY}px`);
        page.style.setProperty("--spotlight-opacity", "1");
      });
    };

    const hideSpotlight = () => {
      page.style.setProperty("--spotlight-opacity", "0");
    };

    window.addEventListener("pointermove", updateSpotlight);
    window.addEventListener("pointerleave", hideSpotlight);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      window.removeEventListener("pointermove", updateSpotlight);
      window.removeEventListener("pointerleave", hideSpotlight);
    };
  }, [hasHydrated]);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      setHasHydrated(true);
    }, 0);

    return () => {
      window.clearTimeout(hydrationTimer);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      const immediateTimer = window.setTimeout(() => {
        setIsLoaderVisible(false);
        setIsPageReady(true);
      }, 0);

      return () => {
        window.clearTimeout(immediateTimer);
      };
    }

    const readyTimer = window.setTimeout(() => {
      setIsPageReady(true);
    }, 120);

    const hideLoaderTimer = window.setTimeout(() => {
      setIsLoaderVisible(false);
    }, 1050);

    return () => {
      window.clearTimeout(readyTimer);
      window.clearTimeout(hideLoaderTimer);
    };
  }, []);

  useEffect(() => {
    const syncHash = () => {
      const nextHash = window.location.hash || "#servicos";
      setActiveSection(nextHash);
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    const sections = ["servicos", "projetos", "contato"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveSection(`#${visibleEntry.target.id}`);
        }
      },
      {
        rootMargin: "-140px 0px -55% 0px",
        threshold: [0.2, 0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("hashchange", syncHash);
      observer.disconnect();
    };
  }, []);

  const handleNavClick = (hash: "#servicos" | "#projetos" | "#contato") => {
    setActiveSection(hash);
  };

  const handlePreviousProject = () => {
    setActiveProjectIndex((current) => (current === 0 ? projects.length - 1 : current - 1));
  };

  const handleNextProject = () => {
    setActiveProjectIndex((current) => (current === projects.length - 1 ? 0 : current + 1));
  };

  if (!hasHydrated) {
    return (
      <div className={styles.page}>
        <div aria-hidden="true" className={styles.loaderOverlay}>
          <div className={styles.loaderMark}>
            <span className={styles.loaderLogo} />
            <span>DaBi Tech</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} ref={pageRef}>
      {isLoaderVisible ? (
        <div aria-hidden="true" className={styles.loaderOverlay}>
          <div className={styles.loaderMark}>
            <span className={styles.loaderLogo} />
            <span>DaBi Tech</span>
          </div>
        </div>
      ) : null}
      <div className={styles.pageAura} aria-hidden="true" />
      <div className={styles.mouseGlow} aria-hidden="true" />
      <aside className={styles.socialRail} aria-label="Redes sociais">
        <a
          aria-label="Instagram DaBi Tech"
          className={styles.socialRailLink}
          href={INSTAGRAM_URL}
          rel="noreferrer"
          target="_blank"
        >
          <InstagramIcon />
        </a>
      </aside>

      <header className={styles.header}>
        <a className={styles.brand} href="#">
          <Image alt="Ícone DaBi Tech" height={48} priority src="/logo-icon.svg" width={48} />
          <div className={styles.brandCopy}>
            <strong>DaBi Tech</strong>
            <span>Digital Solutions</span>
          </div>
        </a>

        <nav className={styles.nav}>
          <a
            className={activeSection === "#servicos" ? styles.navLinkActive : styles.navLink}
            href="#servicos"
            onClick={() => handleNavClick("#servicos")}
          >
            Serviços
          </a>
          <a
            className={activeSection === "#projetos" ? styles.navLinkActive : styles.navLink}
            href="#projetos"
            onClick={() => handleNavClick("#projetos")}
          >
            Projetos
          </a>
          <a
            className={activeSection === "#contato" ? styles.navLinkActive : styles.navLink}
            href="#contato"
            onClick={() => handleNavClick("#contato")}
          >
            Contato
          </a>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.secondaryCta} href="#contato">
            Falar comigo
          </Link>
          <Link className={styles.primaryCta} href="#projetos">
            Ver projetos
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={isPageReady ? styles.heroEntered : styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Portfólio</span>
            <h1>Sites e sistemas com presença forte, leitura clara e estrutura pronta para operar.</h1>
            <p className={styles.heroLead}>
              Desenvolvo produtos digitais com foco em valor percebido, consistência visual e base
              técnica sólida para publicar, manter e evoluir.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="#projetos">
                Explorar portfólio
              </Link>
              <a className={styles.secondaryCta} href="#contato">
                Falar comigo
              </a>
            </div>

            <div className={styles.highlightGrid}>
              {highlights.map((item) => (
                <article className={styles.highlightCard} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </div>

          <aside className={styles.heroFeature}>
            <div className={styles.featureHeader}>
              <span className={styles.featureTag}>Projeto em destaque</span>
              <span className={styles.featureIndex}>01</span>
            </div>

            <div className={styles.featureImageWrap}>
              <Image
                alt={featuredProject.imageAlt}
                height={featuredProject.imageHeight}
                priority
                src={featuredProject.imageSrc}
                width={featuredProject.imageWidth}
              />
            </div>

            <div className={styles.featureBody}>
              <span className={styles.featureEyebrow}>{featuredProject.eyebrow}</span>
              <h2>{featuredProject.title}</h2>
              <p>{featuredProject.description}</p>
            </div>

            <div className={styles.featureMeta}>
              {featuredProject.meta.slice(0, 3).map((item) => (
                <span key={item}>+ {item}</span>
              ))}
            </div>

            <Link className={styles.primaryCta} href={featuredProject.href}>
              Abrir projeto
            </Link>
          </aside>
        </section>

        <section
          className={isPageReady ? styles.servicesSectionEntered : styles.servicesSection}
          id="servicos"
        >
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Serviços</span>
            <h2>Direção visual, interface e operação tratadas como um único produto.</h2>
            <p>
              Não se trata apenas de estética. É sobre construir um sistema digital que comunica
              bem, funciona corretamente e continua sustentável após o lançamento.
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <article className={styles.serviceCard} key={service.title}>
                <span className={styles.serviceIndex}>{String(index + 1).padStart(2, "0")}</span>
                <strong>{service.title}</strong>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className={isPageReady ? styles.projectsSectionEntered : styles.projectsSection}
          id="projetos"
        >
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>Projetos</span>
            <h2>Uma vitrine direta, navegável e com contexto suficiente para cada entrega.</h2>
            <p>
              Cada projeto combina visão de produto, interface publicada e recorte técnico real do
              que foi desenvolvido.
            </p>
          </div>

          <div className={styles.carouselShell}>
            <article className={styles.projectCard}>
              <div className={styles.projectVisual}>
                <Image
                  alt={activeProject.imageAlt}
                  height={activeProject.imageHeight}
                  src={activeProject.imageSrc}
                  width={activeProject.imageWidth}
                />
              </div>

              <div className={styles.projectBody}>
                <div className={styles.projectHeader}>
                  <div className={styles.projectHeaderTop}>
                    <span className={styles.projectBadge}>{activeProject.eyebrow}</span>
                    <span className={styles.projectNumber}>
                      {String(activeProjectIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3>{activeProject.title}</h3>
                  <p>{activeProject.description}</p>
                </div>

                <div className={styles.projectMeta}>
                  {activeProject.meta.map((item) => (
                    <span key={item}>+ {item}</span>
                  ))}
                </div>

                <div className={styles.scopeCard}>
                  <strong>{activeProject.scopeTitle}</strong>
                  <p>{activeProject.scopeDescription}</p>
                </div>

                <div className={styles.projectActions}>
                  <Link className={styles.primaryCta} href={activeProject.href}>
                    Abrir projeto completo
                  </Link>
                </div>
              </div>
            </article>

            <div className={styles.carouselFooter}>
              <div className={styles.carouselControls}>
                <button
                  aria-label="Projeto anterior"
                  className={styles.carouselButton}
                  onClick={handlePreviousProject}
                  type="button"
                >
                  Anterior
                </button>
                <button
                  aria-label="Próximo projeto"
                  className={styles.carouselButton}
                  onClick={handleNextProject}
                  type="button"
                >
                  Próximo
                </button>
              </div>

              <div className={styles.carouselDots} role="tablist" aria-label="Projetos do portfólio">
                {projects.map((project, index) => (
                  <button
                    aria-label={`Ir para ${project.title}`}
                    aria-selected={activeProjectIndex === index}
                    className={
                      activeProjectIndex === index ? styles.carouselDotActive : styles.carouselDot
                    }
                    key={project.href}
                    onClick={() => setActiveProjectIndex(index)}
                    role="tab"
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className={isPageReady ? styles.contactSectionEntered : styles.contactSection}
          id="contato"
        >
          <div className={styles.contactCopy}>
            <span className={styles.eyebrow}>Contato</span>
            <h2>Vamos tirar sua ideia do papel.</h2>
            <p>
              Se fizer sentido para o seu negócio, eu desenvolvo.
            </p>
            <p>
              Transformo sua necessidade em um site institucional, sistema interno ou produto web
              com visual consistente e operação alinhada ao momento do projeto.
            </p>
          </div>

          <div className={styles.contactActions}>
            <a className={styles.primaryCta} href="mailto:dabitech.ds@gmail.com">
              dabitech.ds@gmail.com
            </a>
            <Link
              className={styles.secondaryCta}
              href="https://wa.me/5541920038570"
              rel="noreferrer"
              target="_blank"
            >
              Orçamento no WhatsApp
            </Link>
          </div>
        </section>

        <footer className={isPageReady ? styles.footerEntered : styles.footer}>
          <div className={styles.footerBrand}>
            <span>DaBi Tech - Digital Solutions</span>
            <span>Produtos digitais com posicionamento, clareza e execução.</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
