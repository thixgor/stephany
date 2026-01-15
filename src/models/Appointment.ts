import mongoose, { Schema, Model } from 'mongoose';
import { IAppointment, AppointmentStatus } from '@/types';

export interface IAppointmentDocument extends Omit<IAppointment, '_id'>, mongoose.Document { }

const AppointmentSchema = new Schema(
    {
        protocol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
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
        services: [{
            type: Schema.Types.ObjectId,
            ref: 'Service',
        }],
        additionalServices: [{
            type: String,
            trim: true,
        }],
        totalValue: {
            type: Number,
            required: true,
            min: [0, 'Valor deve ser positivo'],
            default: 0,
        },
        scheduledDate: {
            type: Date,
            required: [true, 'Data do agendamento é obrigatória'],
        },
        status: {
            type: String,
            enum: ['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado'] as AppointmentStatus[],
            default: 'agendado',
        },
        notes: {
            type: String,
        },
        location: {
            type: String,
            trim: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pendente', 'pago', 'parcial'],
            default: 'pendente',
        },
        paymentMethod: {
            type: String,
            trim: true,
        },
        hash: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
// Note: protocol index is automatically created by unique: true, so we don't need to declare it again
AppointmentSchema.index({ patientId: 1 });
AppointmentSchema.index({ userId: 1 });
AppointmentSchema.index({ scheduledDate: 1 });
AppointmentSchema.index({ status: 1 });

const Appointment: Model<IAppointmentDocument> = mongoose.models.Appointment || mongoose.model<IAppointmentDocument>('Appointment', AppointmentSchema);

export default Appointment;
