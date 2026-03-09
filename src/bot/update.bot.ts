import { On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { BotService } from "./service.bot";
import { DownloaderService } from "./download/downloader.service";

@Update()
export class UpdateBot {

    // URLlarni vaqtincha xotirada saqlaymiz
    private urlStore = new Map<string, string>();

    constructor(
        private readonly botService: BotService,
        private readonly downloaderService: DownloaderService,
    ) {}

    @Start()
    onStart(ctx: Context) {
        ctx.reply('Salom! YouTube yoki Instagram linkini yuboring 👇');
    }

    @On('text')
    async onText(ctx: Context) {
        const message = ctx.message as any;
        const url = message.text;

        if (!this.botService.isValidLink(url)) {
            ctx.reply('❌ Iltimos link yuboring!');
            return;
        }

        await ctx.deleteMessage(message.message_id);
        await ctx.reply('⏳ Ma\'lumot olinmoqda...');

        const info = await this.downloaderService.getVideoInfo(url);
        const title = info.title || 'Video';
        const thumbnail = info.thumbnail;

        // URLni ID bilan saqlaymiz
        const id = Date.now().toString();
        this.urlStore.set(id, url);

        await ctx.replyWithPhoto(thumbnail, {
            caption: `🎬 ${title}`,
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '360p', callback_data: `video:360p:${id}` },
                        { text: '480p', callback_data: `video:480p:${id}` },
                    ],
                    [
                        { text: '720p', callback_data: `video:720p:${id}` },
                        { text: '1080p', callback_data: `video:1080p:${id}` },
                    ],
                    [
                        { text: '🎵 Audio', callback_data: `audio:${id}` },
                    ]
                ]
            }
        });
    }

    @On('callback_query')
    async onCallback(ctx: Context) {
        const data = (ctx.callbackQuery as any).data as string;
        const user = ctx.from!;

        await ctx.answerCbQuery();
        await ctx.editMessageCaption('⏳ Yuklanmoqda...');

        const parts = data.split(':');
        const type = parts[0];

        try {
            if (type === 'audio') {
                const id = parts[1];
                const url = this.urlStore.get(id)!;
                const info = await this.downloaderService.getVideoInfo(url);
                const title = info.title || 'Audio';
                const file = await this.downloaderService.downloadAudio(url);
                await ctx.replyWithAudio({ source: file }, { title: title });
                this.downloaderService.deleteFile(file);
                this.urlStore.delete(id);

                await this.botService.saveDownload(
                    user.id,
                    user.username ?? 'unknown',
                    url,
                    'audio',
                    'audio'
                );
            }

            if (type === 'video') {
                const quality = parts[1];
                const id = parts[2];
                const url = this.urlStore.get(id)!;
                const file = await this.downloaderService.downloadVideo(url, quality);
                await ctx.replyWithVideo({ source: file });
                this.downloaderService.deleteFile(file);
                this.urlStore.delete(id);

                await this.botService.saveDownload(
                    user.id,
                    user.username ?? 'unknown',
                    url,
                    'video',
                    quality
                );
            }

            await ctx.deleteMessage();

        } catch (e) {
            ctx.reply('❌ Xatolik: ' + e.message);
        }
    }
}