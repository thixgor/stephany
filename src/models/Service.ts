import mongoose, { Schema, Model } from 'mongoose';
import { IService } from '@/types';

export interface IServiceDocument extends IService, mongoose.Document { }

const ServiceSchema = new Schema<IServiceDocument>(
    {
        name: {
            type: String,
            required: [true, 'Nome do serviço é obrigatório'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Preço é obrigatório'],
            min: [0, 'Preço deve ser positivo'],
        },
        duration: {
            type: Number,
            default: 30,
        },
        category: {
            type: String,
            required: true,
            enum: ['consulta', 'vacina', 'exame', 'procedimento', 'outro'],
            default: 'outro',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ isActive: 1 });

const Service: Model<IServiceDocument> = mongoose.models.Service || mongoose.model<IServiceDocument>('Service', ServiceSchema);

export default Service;
