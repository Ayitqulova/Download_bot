
import YTDlpWrap from "yt-dlp-wrap";
import * as fs from 'fs'
import { Injectable } from "@nestjs/common";


@Injectable()
export class DownloaderService {
    private ytDlp = new YTDlpWrap()

    private createFolder() {
        if (!fs.existsSync('downloads')) {
            fs.existsSync('downloads')
        }
    }
async downloadAudio(url: string): Promise<string> {
    this.createFolder();
    const filePath = `downloads/${Date.now()}.m4a`;

    await this.ytDlp.execPromise([
        url,
        '-f', 'bestaudio[ext=m4a]/bestaudio',
        '--no-playlist',
        '-o', filePath,
    ]);

    return filePath;
}

async downloadVideo(url: string, quality: string): Promise<string> {
    this.createFolder();
    const filePath = `downloads/${Date.now()}.mp4`;

    const heights: any = {
        '360p': 360,
        '480p': 480,
        '720p': 720,
        '1080p': 1080,
    };
    const height = heights[quality] || 360;

    await this.ytDlp.execPromise([
        url,
        '-f', `best[height<=${height}][ext=mp4]/best[ext=mp4]/best`,
        '--no-playlist',
        '-o', filePath,
    ]);

    return filePath;
}
   

    async getVideoInfo(url: string): Promise<any> {
    const info = await this.ytDlp.getVideoInfo(url);
    return info;
}

    deleteFile(filePath) {
        if (!fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
}