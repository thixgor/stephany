import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '@/types';

export interface IUserDocument extends IUser, mongoose.Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
    {
        email: {
            type: String,
            required: [true, 'Email é obrigatório'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
        },
        password: {
            type: String,
            required: [true, 'Senha é obrigatória'],
            minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
            select: false,
        },
        name: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ['admin', 'client', 'temp'] as UserRole[],
            default: 'client',
        },
        phone: {
            type: String,
            trim: true,
        },
        cpf: {
            type: String,
            trim: true,
        },
        isTemporary: {
            type: Boolean,
            default: false,
        },
        tempProtocol: {
            type: String,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
// Index definitions removed (duplicate of schema options)

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Prevent duplicate model error in development
const User: Model<IUserDocument> = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);

export default User;
