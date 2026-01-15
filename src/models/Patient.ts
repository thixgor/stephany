import mongoose, { Schema, Model } from 'mongoose';
import { IPatient } from '@/types';

export interface IPatientDocument extends Omit<IPatient, '_id'>, mongoose.Document { }

const PatientSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Nome do animal é obrigatório'],
            trim: true,
        },
        species: {
            type: String,
            required: [true, 'Espécie é obrigatória'],
            enum: ['canino', 'felino', 'ave', 'reptil', 'roedor', 'lagomorfo', 'silvestre', 'outro'],
        },
        speciesOther: {
            type: String,
            trim: true,
        },
        breed: {
            type: String,
            trim: true,
        },
        breedOther: {
            type: String,
            trim: true,
        },
        birthDate: {
            type: Date,
        },
        age: {
            type: String,
            trim: true,
        },
        weight: {
            type: Number,
            min: [0, 'Peso deve ser positivo'],
        },
        color: {
            type: String,
            trim: true,
        },
        microchip: {
            type: String,
            trim: true,
            sparse: true,
        },
        tutorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        tutorName: {
            type: String,
            required: [true, 'Nome do tutor é obrigatório'],
            trim: true,
        },
        tutorCpf: {
            type: String,
            required: [true, 'CPF do tutor é obrigatório'],
            trim: true,
        },
        tutorPhone: {
            type: String,
            required: [true, 'Telefone do tutor é obrigatório'],
            trim: true,
        },
        tutorEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
PatientSchema.index({ name: 'text', tutorName: 'text' });
PatientSchema.index({ tutorCpf: 1 });
PatientSchema.index({ tutorPhone: 1 });
// Note: microchip index removed to avoid duplicate - sparse fields may auto-index in some cases
// If microchip queries become slow, we can add it back with proper configuration
PatientSchema.index({ species: 1 });

const Patient: Model<IPatientDocument> = mongoose.models.Patient || mongoose.model<IPatientDocument>('Patient', PatientSchema);

export default Patient;
