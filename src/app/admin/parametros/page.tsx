'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { ANIMAL_SPECIES } from '@/types';
import { FiSearch, FiActivity, FiDroplet, FiThermometer, FiPercent, FiInfo } from 'react-icons/fi';
import { FaSyringe, FaCalculator, FaWeight } from 'react-icons/fa';

// Flatten species for search
const ALL_SPECIES = Object.values(ANIMAL_SPECIES).sort();

// Constantes fisiológicas aproximadas por grupo (Valores de referência)
// Isso é uma simplificação para auxiliar a decisão clínica.
const SPECIES_CONSTANTS: Record<string, { maintenance: number; k_factor: number; description: string }> = {
    'Canino': { maintenance: 50, k_factor: 95, description: 'Cães adultos (Manutenção 40-60 ml/kg/dia)' },
    'Felino': { maintenance: 45, k_factor: 70, description: 'Gatos adultos (Manutenção 40-50 ml/kg/dia)' },
    'Ave': { maintenance: 50, k_factor: 129, description: 'Aves em geral (Alta taxa metabólica)' }, // Psitacídeos ~129, Passeriformes ~78
    'Réptil': { maintenance: 20, k_factor: 32, description: 'Répteis (Baixa taxa metabólica, ~15-25 ml/kg/dia)' },
    'Roedor': { maintenance: 100, k_factor: 100, description: 'Roedores (Metabolismo muito alto)' },
    'Lagomorfo': { maintenance: 100, k_factor: 100, description: 'Coelhos (100ml/kg/dia)' },
    'Mustelídeo': { maintenance: 60, k_factor: 80, description: 'Furões (Semelhante a gatos)' },
    'Primata': { maintenance: 50, k_factor: 80, description: 'Primatas não humanos' },
    'Default': { maintenance: 50, k_factor: 70, description: 'Valor padrão genérico' },
};

const getConstants = (species: string) => {
    const lower = species.toLowerCase();

    if (lower.includes('cão') || lower.includes('cachorro') || lower.includes('bulldog') || lower.includes('pastor') || lower.includes('shih')) return SPECIES_CONSTANTS['Canino'];
    if (lower.includes('gato') || lower.includes('felino') || lower.includes('persa') || lower.includes('siames')) return SPECIES_CONSTANTS['Felino'];
    if (lower.includes('papagaio') || lower.includes('ara') || lower.includes('calopsita') || lower.includes('periquito') || lower.includes('ave') || lower.includes('arara')) return SPECIES_CONSTANTS['Ave'];
    if (lower.includes('tartaruga') || lower.includes('jabuti') || lower.includes('tigre d') || lower.includes('iguana') || lower.includes('gecko') || lower.includes('pogona') || lower.includes('cobra') || lower.includes('serpente') || lower.includes('teiu')) return SPECIES_CONSTANTS['Réptil'];
    if (lower.includes('rato') || lower.includes('hamster') || lower.includes('mouse') || lower.includes('gerbil') || lower.includes('topolino') || lower.includes('chinchila') || lower.includes('porquinho')) return SPECIES_CONSTANTS['Roedor'];
    if (lower.includes('coelho')) return SPECIES_CONSTANTS['Lagomorfo'];
    if (lower.includes('ferret') || lower.includes('furão')) return SPECIES_CONSTANTS['Mustelídeo'];
    if (lower.includes('macaco') || lower.includes('soim') || lower.includes('sagui')) return SPECIES_CONSTANTS['Primata'];

    return SPECIES_CONSTANTS['Default'];
};

export default function ParametrosPage() {
    const [selectedSpecies, setSelectedSpecies] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('dose');

    // Filter species based on search
    const filteredSpecies = useMemo(() => {
        if (!searchTerm) return ALL_SPECIES; // Show all
        return ALL_SPECIES.filter(s =>
            s.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const constants = useMemo(() => getConstants(selectedSpecies), [selectedSpecies]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-[#00231F]">Parâmetros Clínicos e Calculadoras</h1>
                <p className="text-gray-600">
                    Ferramentas baseadas em referência taxonômica. Selecione a espécie para carregar os parâmetros.
                </p>
            </div>

            {/* Species Selection */}
            <Card hover={false}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Paciente/Espécie</label>
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Pesquisar (ex: Calopsita, Iguana, Gato...)"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#06695C] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-lg custom-scrollbar bg-gray-50">
                        {filteredSpecies.map(species => (
                            <button
                                key={species}
                                onClick={() => setSelectedSpecies(species)}
                                className={`text-sm px-3 py-2 rounded-lg text-left transition-all truncate ${selectedSpecies === species
                                    ? 'bg-[#06695C] text-white font-medium shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-100'
                                    }`}
                            >
                                {species}
                            </button>
                        ))}
                        {filteredSpecies.length === 0 && (
                            <p className="col-span-full text-center text-gray-500 py-4">Nenhuma espécie encontrada.</p>
                        )}
                    </div>

                    {selectedSpecies && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#06695C]/5 p-4 rounded-xl border border-[#06695C]/20 animate-fade-in">
                            <div className="flex items-center gap-2 text-[#06695C] font-bold text-lg">
                                <FaWeight />
                                {selectedSpecies}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                <FiInfo />
                                <span>Ref: {constants.description}</span>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Calculators Tabs */}
            {selectedSpecies && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                        {[
                            { id: 'dose', label: 'Dose', icon: FaSyringe },
                            { id: 'fluido', label: 'Fluidoterapia', icon: FiDroplet },
                            { id: 'calorias', label: 'Nutrição (NEM)', icon: FiActivity },
                            { id: 'conversao', label: 'Conversão', icon: FaCalculator },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                                    ? 'bg-[#06695C] text-white shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#06695C]'
                                    }`}
                            >
                                <tab.icon />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
                        {activeTab === 'dose' && <DoseCalculator species={selectedSpecies} />}
                        {activeTab === 'fluido' && <FluidoCalculator species={selectedSpecies} constants={constants} />}
                        {activeTab === 'calorias' && <CaloriasCalculator species={selectedSpecies} constants={constants} />}
                        {activeTab === 'conversao' && <ConversaoCalculator />}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Calculator Components ---

function DoseCalculator({ species }: { species: string }) {
    const [weight, setWeight] = useState('');
    const [dose, setDose] = useState('');
    const [concentration, setConcentration] = useState('');
    const [result, setResult] = useState<number | null>(null);

    const calculate = () => {
        const w = parseFloat(weight);
        const d = parseFloat(dose);
        const c = parseFloat(concentration);
        if (w && d && c) {
            setResult((w * d) / c);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[#00231F] border-b pb-4">
                <FaSyringe className="text-2xl text-[#06695C]" />
                <h3 className="text-xl font-bold">Cálculo de Dose</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Input
                    label="Peso do Animal (kg)"
                    type="number"
                    placeholder="Ex: 0.5"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    step="0.001"
                />
                <Input
                    label="Dose Prescrita (mg/kg)"
                    type="number"
                    placeholder="Ex: 10"
                    value={dose}
                    onChange={e => setDose(e.target.value)}
                />
                <Input
                    label="Concentração (mg/ml)"
                    type="number"
                    placeholder="Ex: 50"
                    value={concentration}
                    onChange={e => setConcentration(e.target.value)}
                />
            </div>

            <Button onClick={calculate} className="w-full" size="lg">Calcular Volume</Button>

            {result !== null && (
                <div className="mt-8 text-center animate-slide-up">
                    <div className="inline-block p-6 bg-[#FAF8F5] rounded-2xl border-2 border-[#06695C]/10 shadow-sm">
                        <p className="text-gray-600 mb-1 uppercase text-xs font-bold tracking-wider">Volume a administrar</p>
                        <div className="text-5xl font-bold text-[#06695C] mb-2">{result.toFixed(3)} ml</div>
                        <p className="text-xs text-gray-400">Verifique a viabilidade do volume para a via de administração em {species}.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function FluidoCalculator({ species, constants }: { species: string; constants: any }) {
    const [weight, setWeight] = useState('');
    const [dehy, setDehy] = useState('0');
    const [maintenance, setMaintenance] = useState(constants.maintenance.toString());
    const [losses, setLosses] = useState('0');
    const [hours, setHours] = useState('24');
    const [result, setResult] = useState<any>(null);

    // Update default maintenance when species changes
    useMemo(() => {
        setMaintenance(constants.maintenance.toString());
    }, [constants]);

    const calculate = () => {
        const w = parseFloat(weight);
        const d_percent = parseFloat(dehy);
        const m_rate = parseFloat(maintenance);
        const l = parseFloat(losses);
        const h = parseFloat(hours);

        if (w && h > 0) {
            const deficit = w * (d_percent / 100) * 1000; // ml to replace dehydration
            const maint_total = w * m_rate; // ml/day
            const maint_period = (maint_total / 24) * h; // ml for the period
            const loss = l;

            const total_vol = deficit + maint_period + loss;
            const rate_hr = total_vol / h;

            // Drops: macrogotas (20gt/ml) or microgotas (60gt/ml)
            // Usually small animals use micro
            const isSmall = w < 10;
            const drop_factor = isSmall ? 60 : 20;

            const drops_min = (total_vol * drop_factor) / (h * 60);

            setResult({
                total: total_vol,
                rate: rate_hr,
                drops: drops_min,
                dropType: isSmall ? 'Microgotas (60gt/ml)' : 'Macrogotas (20gt/ml)',
                deficit,
                maint_period
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[#00231F] border-b pb-4">
                <FiDroplet className="text-2xl text-blue-500" />
                <h3 className="text-xl font-bold">Planilha de Fluidoterapia</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Input label="Peso (kg)" type="number" step="0.001" value={weight} onChange={e => setWeight(e.target.value)} />
                <Input label="Grau de Desidratação (%)" type="number" value={dehy} onChange={e => setDehy(e.target.value)} placeholder="0 a 12%" />
                <Input
                    label={`Taxa de Manutenção (ml/kg/dia)`}
                    type="number"
                    value={maintenance}
                    onChange={e => setMaintenance(e.target.value)}
                />
                <Input label="Perdas Copiosas Estimadas (ml)" type="number" value={losses} onChange={e => setLosses(e.target.value)} placeholder="Vômito, diarreia..." />
                <Input label="Tempo de Infusão (horas)" type="number" value={hours} onChange={e => setHours(e.target.value)} />
            </div>

            <Button onClick={calculate} className="w-full" size="lg">Calcular Protocolo</Button>

            {result && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800 font-semibold mb-2">Volume Total ({hours}h)</p>
                        <p className="text-3xl font-bold text-blue-600">{result.total.toFixed(1)} ml</p>
                        <div className="mt-2 text-xs text-blue-400">
                            Déficit: {result.deficit.toFixed(0)}ml + Manutenção: {result.maint_period.toFixed(0)}ml
                        </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-sm text-green-800 font-semibold mb-2">Taxa de Infusão</p>
                        <p className="text-3xl font-bold text-green-600">{result.rate.toFixed(1)} ml/h</p>
                        <div className="mt-2 text-xs text-green-500 font-bold">
                            {result.drops.toFixed(0)} gotas/min ({result.dropType})
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function CaloriasCalculator({ species, constants }: { species: string; constants: any }) {
    const [weight, setWeight] = useState('');
    const [k, setK] = useState(constants.k_factor.toString());
    const [factor, setFactor] = useState('1.0');
    const [result, setResult] = useState<any>(null);

    useMemo(() => {
        setK(constants.k_factor.toString());
    }, [constants]);

    const calculate = () => {
        const w = parseFloat(weight);
        const kVal = parseFloat(k);
        const f = parseFloat(factor);

        if (w) {
            // Formula alométrica: NEM = K * (peso ^ 0.75)
            // Répteis: NEM = 10 * (peso ^ 0.75)  (a 28C) - A constante varia MUITO. 
            // Usando fórmula padrão K * W^0.75 como base.

            const rer = kVal * Math.pow(w, 0.75);
            const nem = rer * f;

            setResult({ rer, nem });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[#00231F] border-b pb-4">
                <FiActivity className="text-2xl text-orange-500" />
                <h3 className="text-xl font-bold">Necessidade Energética (NEM)</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Input label="Peso (kg)" type="number" step="0.001" value={weight} onChange={e => setWeight(e.target.value)} />
                <Input
                    label="Constante K (Referência)"
                    type="number"
                    value={k}
                    onChange={e => setK(e.target.value)}
                />
                <div className="col-span-full">
                    <Select
                        label="Fator de Atividade/Doença"
                        value={factor}
                        onChange={e => setFactor(e.target.value)}
                        options={[
                            { value: '1.0', label: '1.0 - Manutenção (Repouso/Hospitalar)' },
                            { value: '1.2', label: '1.2 - Leve atividade / Recuperação' },
                            { value: '1.4', label: '1.4 - Atividade moderada' },
                            { value: '0.8', label: '0.8 - Obesidade (Restrição)' },
                            { value: '1.5', label: '1.5 - Sepse / Trauma grave' },
                            { value: '2.0', label: '2.0 - Alta demanda (Crescimento/Queimadura)' },
                        ]}
                    />
                </div>
            </div>

            <Button onClick={calculate} className="w-full" size="lg">Calcular Kcal/Dia</Button>

            {result && (
                <div className="mt-8 text-center animate-slide-up bg-orange-50 p-6 rounded-2xl border border-orange-100">
                    <p className="text-gray-600 mb-1">Necessidade Energética Calculada</p>
                    <div className="text-4xl font-bold text-orange-600 mb-2">{result.nem.toFixed(0)} kcal/dia</div>
                    <p className="text-xs text-orange-400">Basal (RER): {result.rer.toFixed(0)} kcal/dia</p>
                </div>
            )}
        </div>
    );
}

function ConversaoCalculator() {
    // Calculadora simples de peso
    const [g, setG] = useState('');
    const [kg, setKg] = useState('');

    const handleG = (val: string) => {
        setG(val);
        if (val) setKg((parseFloat(val) / 1000).toString());
        else setKg('');
    }

    const handleKg = (val: string) => {
        setKg(val);
        if (val) setG((parseFloat(val) * 1000).toString());
        else setG('');
    }

    return (
        <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[#00231F] border-b pb-4">
                <FaCalculator className="text-2xl text-gray-500" />
                <h3 className="text-xl font-bold">Conversor Rápido</h3>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <Input label="Gramas (g)" type="number" value={g} onChange={e => handleG(e.target.value)} />
                <Input label="Quilogramas (kg)" type="number" value={kg} onChange={e => handleKg(e.target.value)} />
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">Útil para animais exóticos pequenos.</p>
        </div>
    )
}
