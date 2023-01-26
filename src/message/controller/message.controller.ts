import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post()
  sendMessage(@Body() body: { phoneNumber: string }) {
    return this.messageService.sendSms(body.phoneNumber);
  }
}
