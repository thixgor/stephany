import { Document } from 'mongoose';

// Base Interfaces (Plain Objects)
export type UserRole = 'admin' | 'client' | 'temp';

export interface IUser {
    _id: string;
    email: string;
    name?: string;
    username: string;
    role: UserRole;
    image?: string;
    phone?: string;
    cpf?: string;
    isTemporary: boolean;
    tempProtocol?: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPatient {
    _id: string;
    name: string;
    species: string;
    breed: string;
    birthDate?: Date;
    age?: string;
    weight?: number;
    gender: 'Macho' | 'Fêmea';
    color?: string;
    microchip?: string;
    tutorId?: string;
    tutorName: string;
    tutorCpf: string;
    tutorPhone: string;
    tutorEmail?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IService {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: 'Consulta' | 'Vacina' | 'Exame' | 'Procedimento' | 'Cirurgia' | 'Outro';
    isActive: boolean;
}

export type AppointmentStatus = 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartao_credito' | 'cartao_debito';
export type PaymentStatus = 'pendente' | 'pago' | 'parcial' | 'estornado';

export interface IAppointment {
    _id: string;
    protocol: string;
    patientId: IPatient | string;
    userId?: IUser | string;
    services: IService[] | string[];
    additionalServices?: string[];
    totalValue: number;
    scheduledDate: Date;
    status: AppointmentStatus;
    notes?: string;
    location?: string;
    paymentMethod?: PaymentMethod;
    paymentStatus: PaymentStatus;
    hash?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ReportType = 'laudo' | 'receita' | 'exame' | 'atestado' | 'encaminhamento';

export interface IReport {
    _id: string;
    appointmentId?: IAppointment | string;
    patientId: IPatient | string;
    userId?: IUser | string;
    type: ReportType;
    title: string;
    content: string;
    anamnese?: string;
    physicalExam?: { [key: string]: any };
    prescription?: { [key: string]: any }[];
    examDetails?: { [key: string]: any };
    atestadoDetails?: { [key: string]: any };
    diagnosis?: string;
    observations?: string;
    attachments?: string[];
    signatureType: 'handwritten' | 'electronic';
    signatureImage?: string;
    reportHash?: string;
    accessToken?: string;
    isPublic: boolean;
    status: 'draft' | 'published';
    createdAt: Date;
    updatedAt: Date;
}

// Mongoose Document Interfaces
export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

export interface IPatientDocument extends Omit<IPatient, '_id'>, Document {}

export interface IServiceDocument extends Omit<IService, '_id'>, Document {}

export interface IAppointmentDocument extends Omit<IAppointment, '_id'>, Document {}

export interface IReportDocument extends Omit<IReport, '_id'>, Document {}

// --- Constants ---

export const SPECIES_CATEGORIES = {
    MAMIFEROS: 'Mamíferos',
    AVES: 'Aves',
    REPTEIS: 'Répteis',
    ANFIBIOS: 'Anfíbios',
    PEIXES: 'Peixes',
    INVERTEBRADOS: 'Invertebrados',
    SILVESTRES: 'Silvestres',
};

export const ANIMAL_SPECIES = {
    // Mamíferos Domésticos
    CACHORRO: 'Cachorro',
    GATO: 'Gato',

    // Roedores e Lagomorfos
    COELHO: 'Coelho',
    COELHO_ANAO: 'Coelho Anão',
    COELHO_LIONHEAD: 'Coelho Lionhead',
    PORQUINHO_DA_INDIA: 'Porquinho-da-índia',
    HAMSTER_SIRIO: 'Hamster Sírio',
    HAMSTER_ANAO_RUSSO: 'Hamster Anão Russo',
    HAMSTER_CHINES: 'Hamster Chinês',
    GERBIL: 'Gerbil',
    RATO_DOMESTICO: 'Rato Doméstico (Twister)',
    CAMUNDONGO: 'Camundongo',
    CHINCHILA: 'Chinchila',
    DEGU: 'Degú',
    ESQUILO_DA_MONGOLIA: 'Esquilo-da-mongólia',

    // Outros Mamíferos Exóticos
    FURAO: 'Furão (Ferret)',
    ESQUILO_PLANADOR: 'Esquilo-planador',
    PETAURO_DO_ACUCAR: 'Petauro-do-açúcar (Sugar Glider)',
    OURICO_PIGMEU: 'Ouriço-pigmeu-africano (Hedgehog)',
    MINI_PORCO: 'Mini Porco',

    // Aves Domésticas Convencionais
    GALINHA: 'Galinha',
    GALO: 'Galo',
    CODORNA: 'Codorna',
    CODORNA_JAPONESA: 'Codorna Japonesa',
    PATO: 'Pato',
    MARRECO: 'Marreco',
    PERU: 'Peru',
    GANSO: 'Ganso',
    FAISAO: 'Faisão',
    PAVAO: 'Pavão',
    POMBO_DOMESTICO: 'Pombo-doméstico',
    ROLA: 'Rola',

    // Psitacídeos (Aves)
    RINGNECK: 'Ringneck',
    CALOPSITA: 'Calopsita',
    PERIQUITO_AUSTRALIANO: 'Periquito-australiano',
    AGAPORNIS: 'Agapornis',
    PAPAGAIO_VERDADEIRO: 'Papagaio-verdadeiro',
    PAPAGAIO_DO_CONGO: 'Papagaio-do-congo',
    PAPAGAIO_CINZA: 'Papagaio-cinza-africano',
    PAPAGAIO_ECLECTUS: 'Papagaio-eclectus',
    ARARA_CANINDE: 'Arara-canindé',
    ARARA_VERMELHA: 'Arara-vermelha',
    ARARA_AZUL: 'Arara-azul',
    CACATUA_BRANCA: 'Cacatua-branca',
    CACATUA_ROSA: 'Cacatua-rosa',
    CACATUA_GALAH: 'Cacatua-galah',
    MARITACA: 'Maritaca',

    // Passeriformes e outras aves
    CANARIO: 'Canário',
    COLEIRO: 'Coleiro',
    TRINCA_FERRO: 'Trinca-ferro',
    AZULAO: 'Azulão',
    BICUDO: 'Bicudo',
    CURIO: 'Curió',
    DIAMANTE_DE_GOULD: 'Diamante-de-gould',
    DIAMANTE_MANDARIM: 'Diamante-mandarim',
    MANON: 'Manon',
    TENTILHAO: 'Tentilhão',
    MAINA: 'Mainá',
    ESTORNINHO: 'Estorninho',

    // Répteis - Lagartos
    GECKO_LEOPARDO: 'Gecko-leopardo',
    GECKO_TOKAY: 'Gecko-tokay',
    GECKO_DOURADO: 'Gecko-dourado',
    DRAGAO_BARBUDO: 'Dragão-barbudo',
    ANOLIS: 'Anolis',
    IGUANA_VERDE: 'Iguana-verde',
    IGUANA_AZUL: 'Iguana-azul',
    TEIU: 'Teiú',
    LAGARTO_CAUDA_ESPINHOSA: 'Lagarto-de-cauda-espinhosa',
    LAGARTO_MONITOR: 'Lagarto-monitor',

    // Répteis - Serpentes
    JIBOIA: 'Jiboia',
    JIBOIA_ARCO_IRIS: 'Jiboia-arco-íris',
    PITON_BOLA: 'Píton-bola',
    PITON_REAL: 'Píton-real',
    PITON_TAPETE: 'Píton-tapete',
    COBRA_MILHO: 'Cobra-do-milho (Corn Snake)',
    COBRA_REI: 'Cobra-rei-da-califórnia',
    COBRA_LEITEIRA: 'Cobra-leiteira (Milk Snake)',
    COBRA_RATO: 'Cobra-rato',

    // Répteis - Quelônios
    TIGRE_DAGUA: 'Tigre-d’água',
    TARTARUGA_ORELHA_VERMELHA: 'Tartaruga-orelha-vermelha',
    TARTARUGA_ORELHA_AMARELA: 'Tartaruga-orelha-amarela',
    CAGADO: 'Cágado',
    JABUTI_PIRANGA: 'Jabuti-piranga',
    JABUTI_TINGA: 'Jabuti-tinga',

    // Anfíbios
    SAPO_CURURU: 'Sapo-cururu',
    RA_TOURO: 'Rã-touro',
    RA_ARBORICOLA: 'Rã-arborícola',
    SAPO_LEITEIRO: 'Sapo-leiteiro',
    AXOLOTE: 'Axolote',
    SALAMANDRA: 'Salamandra',

    // Peixes Água Doce
    BETTA: 'Betta',
    GUPPY: 'Guppy',
    MOLLY: 'Molly',
    PLATY: 'Platy',
    ESPADA: 'Espada',
    NEON: 'Neon',
    TETRA: 'Tetra',
    ACARA_DISCO: 'Acará-disco',
    ACARA_BANDEIRA: 'Acará-bandeira',
    OSCAR: 'Oscar',
    KINGUIO: 'Kinguio',
    CASCUDO: 'Cascudo',
    CORIDORA: 'Coridora',

    // Peixes Água Salgada
    PEIXE_PALHACO: 'Peixe-palhaço',
    PEIXE_CIRURGIAO: 'Peixe-cirurgião',
    PEIXE_ANJO: 'Peixe-anjo-marinho',
    GOBY: 'Goby',
    BLENNY: 'Blenny',
    CAVALO_MARINHO: 'Cavalo-marinho',

    // Invertebrados
    TARANTULA: 'Tarântula',
    ARANHA_CARANGUEJEIRA: 'Aranha-caranguejeira',
    ESCORPIAO_IMPERADOR: 'Escorpião-imperador',
    ESCORPIAO_DESERTO: 'Escorpião-do-deserto',
    BICHO_PAU: 'Bicho-pau',
    LOUVA_A_DEUS: 'Louva-a-deus',
    BESOURO_RINOCERONTE: 'Besouro-rinoceronte',
    BESOURO_HERCULES: 'Besouro-hércules',
    BARATA_MADAGASCAR: 'Barata-de-madagascar',
    FORMIGA: 'Formiga-cortadeira',
    CARACOL_GIGANTE: 'Caracol-gigante-africano',
    CARAMUJO: 'Caramujo',
    MINHOCA: 'Minhoca',
    ISOPODE: 'Isópode',

    // Silvestres (Onde permitido)
    RAPOSA: 'Raposa-domesticada',
    CERVO_ANAO: 'Cervo-anão (Muntjac)',
    CAPIVARA: 'Capivara',
    QUATI: 'Quati',
    SAGUI: 'Sagui',
    MACACO_PREGO: 'Macaco-prego',
};

export const DEFAULT_SERVICES = [
    {
        name: 'Consulta de Rotina',
        description: 'Check-up geral, avaliação física e orientações básicas de saúde.',
        price: 150,
        category: 'consulta',
        duration: 45,
    },
    {
        name: 'Vacinação (V10)',
        description: 'Vacina polivalente para cães contra as principais doenças infectocontagiosas.',
        price: 90,
        category: 'vacina',
        duration: 15,
    },
    {
        name: 'Consulta Especializada (Exóticos)',
        description: 'Atendimento para pets não convencionais: aves, répteis e pequenos mamíferos.',
        price: 180,
        category: 'consulta',
        duration: 60,
    },
    {
        name: 'Limpeza de Ouvidos',
        description: 'Higienização profissional do conduto auditivo com produtos veterinários.',
        price: 45,
        category: 'procedimento',
        duration: 20,
    },
    {
        name: 'Corte de Unhas / Desbaste de Bico',
        description: 'Manutenção de garras para cães/gatos ou bico para aves.',
        price: 35,
        category: 'procedimento',
        duration: 15,
    }
];
