import { Header, Footer, WhatsAppButton } from '@/components/layout';
import { ServiceCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { FiHome, FiShield, FiHeart, FiCalendar, FiActivity, FiSearch } from 'react-icons/fi';
import { FaFeatherAlt, FaDog } from 'react-icons/fa';

export default function ServicesPage() {
    const services = [
        {
            icon: <FiHome />,
            title: 'Atendimento Domiciliar',
            description: 'Consultas completas no conforto do seu lar, reduzindo o estresse do animal e proporcionando maior comodidade para você.',
            details: [
                'Exame físico completo',
                'Avaliação do ambiente',
                'Vacinação em domicílio',
                'Atestados de saúde'
            ]
        },
        {
            icon: <FaFeatherAlt />,
            title: 'Pets Exóticos',
            description: 'Atendimento especializado para aves, répteis, roedores e lagomorfos. Conhecimento técnico específico para cada espécie.',
            details: [
                'Manejo adequado',
                'Orientações nutricionais',
                'Sexagem de aves',
                'Corte de penas e unhas (quando indicado)'
            ]
        },
        {
            icon: <FiShield />,
            title: 'Vacinação',
            description: 'Protocolos vacinais personalizados para cães, gatos e ferrets, utilizando as melhores vacinas importadas do mercado.',
            details: [
                'Polivalentes (V8/V10/V4/V5)',
                'Antirrábica',
                'Giárdia e Gripe',
                'Carteirinha de vacinação'
            ]
        },
        {
            icon: <FiSearch />,
            title: 'Exames Laboratoriais',
            description: 'Coleta de material para exames de sangue, urina, fezes e dermatológicos, realizada em domicílio.',
            details: [
                'Hemograma e Bioquímicos',
                'Sorologias',
                'Exames hormonais',
                'Parasitológicos'
            ]
        },
        {
            icon: <FiActivity />,
            title: 'Fluidoterapia',
            description: 'Administração de soro e medicamentos injetáveis em domicílio para animais que necessitam de suporte.',
            details: [
                'Reidratação',
                'Aplicação de medicamentos',
                'Acompanhamento clínico',
                'Suporte nutricional'
            ]
        },
        {
            icon: <FaDog />,
            title: 'Microchipagem',
            description: 'Implantação de microchip para identificação definitiva do seu pet, essencial para viagens internacionais.',
            details: [
                'Aplicação indolor',
                'Leitura e cadastro',
                'Certificado de microchipagem',
                'Padrão internacional ISO'
            ]
        }
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16 bg-[#FAF8F5]">
                <section className="px-4 sm:px-6 mb-16">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#00231F] mb-6">Nossos Serviços</h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Oferecemos um atendimento veterinário completo e humanizado, levando a clínica até a sua casa.
                            Conheça os detalhes de cada serviço prestado.
                        </p>
                    </div>
                </section>

                <section className="px-4 sm:px-6 mb-20">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={index}
                                icon={service.icon}
                                title={service.title}
                                description={service.description}
                            />
                        ))}
                    </div>
                </section>

                <section className="bg-white py-16 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-[#00231F] mb-6">Precisa de um serviço específico?</h2>
                        <p className="text-gray-600 mb-8">
                            Entre em contato para conversarmos sobre a necessidade do seu pet.
                            Realizamos diversos procedimentos ambulatoriais em domicílio.
                        </p>
                        <Link href="https://wa.me/5521975787940" target="_blank">
                            <Button variant="whatsapp" size="lg">
                                Falar com a Dra. Stephany
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
