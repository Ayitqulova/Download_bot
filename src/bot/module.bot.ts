import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UpdateBot } from "./update.bot";
import { BotService } from "./service.bot";
import { DownloaderService } from "./download/downloader.service";
import { Download, DownloadSchema } from "./schema/download.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Download.name, schema: DownloadSchema }
        ])
    ],
    providers: [UpdateBot, BotService, DownloaderService]
})
export class BotModule {}