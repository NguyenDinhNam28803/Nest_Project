import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator',
}

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export class User {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER,
    })
    role: UserRole;

    @Prop({ default: null })
    avatar: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isEmailVerified: boolean;

    @Prop()
    lastLoginAt: Date;

    @Prop({ default: 0 })
    loginAttempts: number;

    @Prop()
    passwordChangedAt: Date;

    @Prop()
    passwordResetToken: string;

    @Prop()
    passwordResetExpires: Date;

  // Virtual for full URL to avatar
    public get avatarUrl(): string | null {
        return this.avatar ? `${process.env.APP_URL}${this.avatar}` : null;
    }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });

// Virtual for user's full profile URL
UserSchema.virtual('profileUrl').get(function (this: UserDocument) {
    return `${process.env.APP_URL}/users/${this._id}`;
});
