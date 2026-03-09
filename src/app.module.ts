import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/module.bot';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true, 
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN as string
    }),

    MongooseModule.forRoot(process.env.MONGO_URL as string),
    
    BotModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
