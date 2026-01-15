import { z } from 'zod';

// User registration schema
export const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    name: z.string().optional(),
    username: z.string().optional(),
    phone: z.string().optional(),
});

// User login schema
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

// CPF validation regex
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;

// Phone validation regex
const phoneRegex = /^\(?\d{2}\)?[\s.-]?\d{4,5}[\s.-]?\d{4}$/;

// Patient schema
export const patientSchema = z.object({
    name: z.string().min(1, 'Nome do animal é obrigatório'),
    species: z.enum(['canino', 'felino', 'ave', 'reptil', 'roedor', 'lagomorfo', 'silvestre', 'outro']),
    speciesOther: z.string().optional(),
    breed: z.string().optional(),
    breedOther: z.string().optional(),
    birthDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
    age: z.string().optional(),
    weight: z.number().positive('Peso deve ser positivo').optional(),
    color: z.string().optional(),
    microchip: z.string().optional(),
    tutorName: z.string().min(1, 'Nome do tutor é obrigatório'),
    tutorCpf: z.string().regex(cpfRegex, 'CPF inválido'),
    tutorPhone: z.string().regex(phoneRegex, 'Telefone inválido'),
    tutorEmail: z.string().email('Email inválido').optional().or(z.literal('')),
    notes: z.string().optional(),
});

// Appointment schema
export const appointmentSchema = z.object({
    patientId: z.string().min(1, 'Paciente é obrigatório'),
    services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
    additionalServices: z.array(z.string()).optional(),
    totalValue: z.number().min(0, 'Valor inválido'),
    scheduledDate: z.string().transform(val => new Date(val)),
    notes: z.string().optional(),
    location: z.string().optional(),
});

// Report schema
export const reportSchema = z.object({
    appointmentId: z.string().min(1, 'Atendimento é obrigatório'),
    patientId: z.string().min(1, 'Paciente é obrigatório'),
    type: z.enum(['laudo', 'receita', 'exame', 'atestado', 'encaminhamento']),
    title: z.string().min(1, 'Título é obrigatório'),
    content: z.string().optional(),

    // Optional clinical data
    anamnese: z.string().optional(),
    physicalExam: z.object({
        temp: z.string().optional(),
        fc: z.string().optional(),
        fr: z.string().optional(),
        mucosas: z.string().optional(),
        tpc: z.string().optional(),
        linfonodos: z.string().optional(),
        systems: z.object({
            cardiovascular: z.string().optional(),
            respiratorio: z.string().optional(),
            digestorio: z.string().optional(),
            neurologico: z.string().optional(),
            tegumentar: z.string().optional(),
            locomotor: z.string().optional(),
            outros: z.string().optional(),
        }).optional(),
    }).optional(),

    prescription: z.array(z.object({
        medication: z.string().min(1, 'Nome do medicamento é obrigatório'),
        activePrinciple: z.string().optional(),
        concentration: z.string().optional(),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.string().optional(),
        route: z.string().optional(),
        quantity: z.string().optional(),
        notes: z.string().optional(),
    })).optional(),

    examDetails: z.object({
        material: z.string().optional(),
        method: z.string().optional(),
        collectionDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
        sampleCondition: z.string().optional(),
        results: z.array(z.object({
            parameter: z.string().optional(),
            value: z.string().optional(),
            reference: z.string().optional(),
            unit: z.string().optional(),
        })).optional(),
    }).optional(),

    atestadoDetails: z.object({
        declaration: z.string().optional(),
        startDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
        endDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
        canTravel: z.boolean().optional(),
    }).optional(),

    diagnosis: z.string().optional(),
    observations: z.string().optional(),
    isPublic: z.boolean().optional(),
    status: z.enum(['draft', 'published']).default('published'),
    signatureType: z.enum(['electronic', 'handwritten']),
    signatureImage: z.string().optional(),
});

// Service schema
export const serviceSchema = z.object({
    name: z.string().min(1, 'Nome do serviço é obrigatório'),
    description: z.string().optional(),
    price: z.number().min(0, 'Preço deve ser positivo'),
    duration: z.number().min(1, 'Duração mínima de 1 min').optional(),
    category: z.enum(['consulta', 'vacina', 'exame', 'procedimento', 'outro']),
    isActive: z.boolean().optional(),
});

// Search schema
export const searchSchema = z.object({
    query: z.string().min(1, 'Termo de busca é obrigatório'),
    type: z.enum(['patient', 'tutor', 'all']).optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PatientInput = z.infer<typeof patientSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
