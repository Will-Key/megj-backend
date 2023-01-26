import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        baseURL: 'https://api.letexto.com/v1/',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + config.get<{ key: string }>('letextoconfig').key,
        },
      }),
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
