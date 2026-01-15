import mongoose, { Schema, Model } from 'mongoose';
import { IReport, ReportType } from '@/types';
import { generateProtocol } from '@/lib/utils';

export interface IReportDocument extends Omit<IReport, '_id'>, mongoose.Document { }

const ReportSchema = new Schema<IReportDocument>(
    {
        appointmentId: {
            type: Schema.Types.ObjectId,
            ref: 'Appointment',
            required: [true, 'Atendimento é obrigatório'],
        },
        patientId: {
            type: Schema.Types.ObjectId,
            ref: 'Patient',
            required: [true, 'Paciente é obrigatório'],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        type: {
            type: String,
            enum: ['laudo', 'receita', 'exame', 'atestado', 'encaminhamento'] as ReportType[],
            required: true,
            default: 'laudo',
        },
        title: {
            type: String,
            required: [true, 'Título é obrigatório'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Conteúdo é obrigatório'],
        },

        // Detailed Clinical Info
        anamnese: String,
        physicalExam: {
            temp: String,
            fc: String,
            fr: String,
            mucosas: String,
            tpc: String,
            linfonodos: String,
            systems: {
                cardiovascular: String,
                respiratorio: String,
                digestorio: String,
                neurologico: String,
                tegumentar: String,
                locomotor: String,
                outros: String,
            },
        },

        // Prescription Info
        prescription: [{
            medication: { type: String, required: true },
            activePrinciple: String,
            concentration: String,
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
            route: String,
            quantity: String,
            notes: String,
        }],

        // Exam Info
        examDetails: {
            material: String,
            method: String,
            collectionDate: Date,
            sampleCondition: String,
            results: [{
                parameter: String,
                value: String,
                reference: String,
                unit: String,
            }],
        },

        // Atestado Info
        atestadoDetails: {
            declaration: String,
            startDate: Date,
            endDate: Date,
            canTravel: Boolean,
        },

        diagnosis: {
            type: String,
        },
        observations: {
            type: String,
        },
        attachments: [{
            type: String,
        }],

        // Security
        signatureType: {
            type: String,
            enum: ['handwritten', 'electronic'],
            default: 'electronic',
        },
        signatureImage: String,
        reportHash: {
            type: String,
            unique: true,
            sparse: true,
        },
        accessToken: {
            type: String,
            required: true,
            unique: true,
            default: generateProtocol,
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
// Note: accessToken index is automatically created by unique: true, so we don't need to declare it again
ReportSchema.index({ appointmentId: 1 });
ReportSchema.index({ patientId: 1 });
ReportSchema.index({ type: 1 });

const Report: Model<IReportDocument> = mongoose.models.Report || mongoose.model<IReportDocument>('Report', ReportSchema);

export default Report;
