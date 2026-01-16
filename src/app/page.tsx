import Image from 'next/image';
import Link from 'next/link';
import { FaDog, FaCat, FaFeatherAlt } from 'react-icons/fa';
import { GiRabbit, GiTurtle, GiRat } from 'react-icons/gi';
import { FiCalendar, FiHeart, FiShield, FiHome } from 'react-icons/fi';
import { Header, Footer, WhatsAppButton } from '@/components/layout';
import { ServiceCard, TestimonialCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

import HeroImageSlider from '@/components/ui/HeroImageSlider';

export default function HomePage() {
  const services = [
    {
      icon: <FiHome />,
      title: 'Consultas Domiciliares',
      description: 'Atendimento veterinário completo no conforto do seu lar. Menos estresse para o seu pet!',
    },
    {
      icon: <FiShield />,
      title: 'Vacinação',
      description: 'Proteja seu pet com o calendário de vacinas atualizado. V8, V10, antirrábica e mais.',
    },
    {
      icon: <FaFeatherAlt />,
      title: 'Pets Exóticos',
      description: 'Atendimento especializado para aves, répteis, roedores e outros pets não convencionais.',
    },
    {
      icon: <FiHeart />,
      title: 'Orientações',
      description: 'Orientações de manejo, nutrição e bem-estar personalizadas para o seu companheiro.',
    },
    {
      icon: <FiCalendar />,
      title: 'Coleta de Exames',
      description: 'Coleta de sangue, urina e outros materiais para exames laboratoriais completos.',
    },
    {
      icon: <FiShield />,
      title: 'Microchipagem',
      description: 'Identificação permanente do seu pet para maior segurança e rastreabilidade.',
    },
  ];

  const testimonials = [
    {
      text: 'A Dra. Stephany é incrível! Meu gatinho tem muito medo de sair de casa, e o atendimento domiciliar fez toda a diferença. Muito profissional e carinhosa!',
      author: 'Carla Mendes',
      pet: 'Mingau (gato)',
      initials: 'CM',
    },
    {
      text: 'Tenho um ringneck e foi difícil encontrar alguém especializado em aves. A Dra. Stephany entende muito de pets exóticos. Super recomendo!',
      author: 'Roberto Silva',
      pet: 'Kiwi (ringneck)',
      initials: 'RS',
    },
    {
      text: 'Atendimento pontual, explicações claras e muito amor pelos animais. Minha cachorrinha idosa precisa de cuidados especiais e a doutora é muito atenciosa.',
      author: 'Ana Paula Costa',
      pet: 'Luna (poodle)',
      initials: 'AC',
    },
    {
      text: 'A Dra. foi super atenciosa com meu porquinho-da-índia. Difícil encontrar veterinário que atende roedores com tanta dedicação!',
      author: 'Juliana Ferreira',
      pet: 'Pipoca (porquinho-da-índia)',
      initials: 'JF',
    },
  ];

  const petIcons = [
    { icon: FaDog, label: 'Cães' },
    { icon: FaCat, label: 'Gatos' },
    { icon: FaFeatherAlt, label: 'Aves' },
    { icon: GiTurtle, label: 'Répteis' },
    { icon: GiRabbit, label: 'Coelhos' },
    { icon: GiRat, label: 'Roedores' },
  ];

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-[#FAF8F5] to-white">
          {/* Decorative paw prints */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute top-[10%] left-[5%] w-24 h-24 text-[#06695C] opacity-5 rotate-[-15deg]" viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="12" cy="15" rx="5" ry="4.5" />
              <ellipse cx="6" cy="8" rx="2.5" ry="3" />
              <ellipse cx="18" cy="8" rx="2.5" ry="3" />
              <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
              <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
            </svg>
            <svg className="absolute top-[30%] right-[8%] w-32 h-32 text-[#06695C] opacity-5 rotate-[25deg]" viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="12" cy="15" rx="5" ry="4.5" />
              <ellipse cx="6" cy="8" rx="2.5" ry="3" />
              <ellipse cx="18" cy="8" rx="2.5" ry="3" />
              <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
              <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
            </svg>
            <svg className="absolute bottom-[15%] left-[10%] w-20 h-20 text-[#06695C] opacity-5 rotate-[10deg]" viewBox="0 0 24 24" fill="currentColor">
              <ellipse cx="12" cy="15" rx="5" ry="4.5" />
              <ellipse cx="6" cy="8" rx="2.5" ry="3" />
              <ellipse cx="18" cy="8" rx="2.5" ry="3" />
              <ellipse cx="7.5" cy="13" rx="2" ry="2.5" transform="rotate(-20 7.5 13)" />
              <ellipse cx="16.5" cy="13" rx="2" ry="2.5" transform="rotate(20 16.5 13)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#06695C]/10 text-[#06695C] rounded-full text-sm font-semibold mb-6">
                <span className="w-2 h-2 bg-[#06695C] rounded-full animate-pulse"></span>
                Atendimento Domiciliar no Rio de Janeiro
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-[#00231F] to-[#06695C] bg-clip-text text-transparent">
                  Cuidado veterinário
                </span>
                <br />
                <span className="text-[#06695C]">no conforto do lar</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Sou a <strong>Dra. Stephany Rodrigues</strong>, médica veterinária especializada em atendimento domiciliar. Cuido de cães, gatos e pets exóticos com todo o carinho que eles merecem.
              </p>

              {/* Pet icons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                {petIcons.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-sm border border-gray-100 text-sm text-gray-600"
                  >
                    <Icon className="text-[#06695C]" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="https://wa.me/5521975787940?text=Olá%2C%20Dra.%20Stephany%21%20Gostaria%20de%20agendar%20uma%20consulta%20domiciliar%20para%20o%20meu%20pet.%20%F0%9F%90%BE" target="_blank">
                  <Button variant="whatsapp" size="lg">
                    Agendar Consulta
                  </Button>
                </Link>
                <Link href="/servicos">
                  <Button variant="secondary" size="lg">
                    Ver Serviços
                  </Button>
                </Link>
              </div>

              {/* Credentials */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  <strong className="text-[#00231F]">CRMV-RJ: 22404</strong> · Pós-graduanda em Clínica Médica e Cirúrgica de Animais Selvagens e Exóticos
                </p>
              </div>
            </div>

            {/* Image Slider */}
            <div className="relative animate-fade-in delay-2">
              <div className="relative z-10">
                <HeroImageSlider />
              </div>
              <div className="absolute -top-6 -right-6 w-full h-full border-4 border-[#06695C] rounded-3xl z-0 hidden lg:block"></div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 lg:left-auto lg:-right-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 z-20">
                <div className="w-12 h-12 bg-[#06695C]/10 rounded-full flex items-center justify-center text-[#06695C] text-2xl">
                  <FiHeart />
                </div>
                <div>
                  <p className="font-bold text-[#00231F]">Atendimento</p>
                  <p className="text-sm text-gray-500">Domiciliar Exclusivo</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 px-4 sm:px-6 bg-white" id="servicos">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#06695C] font-semibold text-sm uppercase tracking-wider">Nossos Serviços</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#00231F] mt-2">
                Cuidado completo para o seu pet
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Oferecemos uma gama completa de serviços veterinários no conforto da sua casa
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  className={`animate-fade-in delay-${index + 1}`}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/servicos">
                <Button variant="primary" size="lg">
                  Ver Todos os Serviços
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[#06695C] to-[#00231F] text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#0A8B7A] font-semibold text-sm uppercase tracking-wider">Sobre Mim</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6">
                  Dra. Stephany Rodrigues
                </h2>
                <div className="space-y-4 text-white/90">
                  <p>
                    Sou médica veterinária <strong>CRMV-RJ 22404</strong>, apaixonada por animais desde sempre. Minha missão é proporcionar o melhor cuidado para o seu pet, com a praticidade do atendimento domiciliar.
                  </p>
                  <p>
                    Atualmente sou <strong>pós-graduanda em Clínica Médica e Cirúrgica de Animais Selvagens e Exóticos</strong>, o que me permite atender não apenas cães e gatos, mas também aves, répteis, roedores e outros pets não convencionais.
                  </p>
                  <p>
                    Acredito que o ambiente familiar reduz o estresse do animal e proporciona uma consulta mais tranquila e eficiente.
                  </p>
                </div>
                <div className="mt-8">
                  <Link href="/sobre">
                    <Button variant="ghost" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-[#06695C]">
                      Conheça Minha História
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://i.imgur.com/TS2KcZh.png"
                  alt="Logo Dra. Stephany Rodrigues"
                  width={400}
                  height={400}
                  className="mx-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[#06695C] font-semibold text-sm uppercase tracking-wider">Depoimentos</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#00231F] mt-2">
                O que dizem os tutores
              </h2>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                A satisfação dos tutores e o bem-estar dos pets são nossa maior recompensa
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.author}
                  text={testimonial.text}
                  author={testimonial.author}
                  pet={testimonial.pet}
                  initials={testimonial.initials}
                  className={`animate-fade-in delay-${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#00231F] mb-6">
              Pronto para cuidar do seu pet?
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Agende agora uma consulta domiciliar e proporcione o melhor atendimento veterinário para o seu companheiro, sem sair de casa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://wa.me/5521975787940" target="_blank">
                <Button variant="whatsapp" size="lg">
                  Agendar pelo WhatsApp
                </Button>
              </Link>
              <a href="tel:+5521975787940">
                <Button variant="secondary" size="lg">
                  Ligar: (21) 97578-7940
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
