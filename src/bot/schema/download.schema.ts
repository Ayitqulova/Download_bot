import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Download extends Document {

    @Prop()
    userId: number;      // Telegram user id

    @Prop()
    username: string;    // Telegram username

    @Prop()
    url: string;         // Yuklangan link

    @Prop()
    type: string;        // 'video' yoki 'audio'

    @Prop()
    quality: string;     // '360p', '720p' yoki 'audio'
}

export const DownloadSchema = SchemaFactory.createForClass(Download);