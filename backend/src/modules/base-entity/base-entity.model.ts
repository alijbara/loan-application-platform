import { Schema } from 'mongoose';
import { IBaseEntity } from './base-entity.interface';

export const BaseEntitySchema = new Schema<IBaseEntity>({}, { timestamps: true });
