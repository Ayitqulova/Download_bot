import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Download } from './schema/download.schema';

@Injectable()
export class BotService {

    constructor(
        @InjectModel(Download.name)
        private downloadModel: Model<Download>
    ) {}

    // Link tekshirish
    isYouTubeLink(url: string): boolean {
        return url.includes('youtube.com') || url.includes('youtu.be');
    }

    isInstagramLink(url: string): boolean {
        return url.includes('instagram.com');
    }

    isValidLink(url: string): boolean {
        return this.isYouTubeLink(url) || this.isInstagramLink(url);
    }

    // Bazaga saqlash
    async saveDownload(
        userId: number,
        username: string,
        url: string,
        type: string,
        quality: string
    ) {
        await this.downloadModel.create({
            userId,
            username,
            url,
            type,
            quality
        });
    }
}