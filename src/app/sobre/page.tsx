import Image from 'next/image';
import { Header, Footer, WhatsAppButton } from '@/components/layout';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen pt-24 pb-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    {/* Hero Section of About */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                        <div className="order-2 lg:order-1">
                            <span className="text-[#06695C] font-semibold text-sm uppercase tracking-wider">Minha Trajetória</span>
                            <h1 className="text-4xl sm:text-5xl font-bold text-[#00231F] mt-2 mb-6">
                                Dra. Stephany Rodrigues
                            </h1>
                            <div className="prose text-gray-600 space-y-4 text-lg leading-relaxed">
                                <p>
                                    Desde criança, minha paixão pelos animais sempre foi evidente. O sonho de me tornar médica veterinária
                                    não foi apenas uma escolha profissional, mas um chamado para dedicar minha vida ao bem-estar daqueles
                                    que nos oferecem amor incondicional.
                                </p>
                                <p>
                                    Graduada em Medicina Veterinária e devidamente registrada no <strong>CRMV-RJ (22404)</strong>,
                                    tenho pautado minha carreira na excelência técnica e no atendimento humanizado.
                                </p>
                                <p>
                                    Atualmente, estou me especializando através da <strong>Pós-graduação em Clínica Médica e Cirúrgica de Animais
                                        Selvagens e Exóticos</strong>, uma área fascinante que requer conhecimento aprofundado e dedicação
                                    constante para atender aves, répteis, roedores e outros pets não convencionais.
                                </p>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 flex justify-center">
                            <div className="relative w-full max-w-md aspect-[3/4]">
                                <Image
                                    src="https://i.imgur.com/6LGQ8oY.png"
                                    alt="Dra. Stephany Rodrigues"
                                    width={500}
                                    height={500}
                                    className="object-cover rounded-2xl shadow-xl"
                                    priority
                                />
                                <div className="absolute -bottom-6 -left-6 w-full h-full border-4 border-[#06695C] rounded-2xl -z-10 hidden lg:block"></div>
                            </div>
                        </div>
                    </div>

                    {/* Values Section */}
                    <div className="py-16 bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 mb-20">
                        <h2 className="text-3xl font-bold text-[#00231F] text-center mb-12">Meus Valores</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#06695C]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                    ❤️
                                </div>
                                <h3 className="text-xl font-bold text-[#00231F] mb-2">Amor e Empatia</h3>
                                <p className="text-gray-600">
                                    Tratar cada paciente como se fosse único, respeitando suas particularidades e o vínculo com seu tutor.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#06695C]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                    📚
                                </div>
                                <h3 className="text-xl font-bold text-[#00231F] mb-2">Atualização Constante</h3>
                                <p className="text-gray-600">
                                    Busca incessante por conhecimento e novas técnicas para oferecer o melhor tratamento possível.
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#06695C]/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                    🏡
                                </div>
                                <h3 className="text-xl font-bold text-[#00231F] mb-2">Comodidade</h3>
                                <p className="text-gray-600">
                                    Levar o atendimento veterinário de qualidade até a sua casa, priorizando o conforto e a segurança.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#00231F] mb-6">Vamos cuidar do seu pet?</h2>
                        <Link href="https://wa.me/5521975787940?text=Olá%2C%20Dra.%20Stephany%21%20Gostaria%20de%20agendar%20uma%20consulta%20domiciliar%20para%20o%20meu%20pet.%20%F0%9F%90%BE" target="_blank">
                            <Button variant="whatsapp" size="lg">
                                Agendar Consulta
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </>
    );
}
