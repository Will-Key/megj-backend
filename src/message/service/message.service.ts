import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { CREATE_CAMPAIGN_PAYLOAD } from '../utils';

@Injectable()
export class MessageService {
  constructor(
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  sendSms(phoneNumber: string) {
    try {
      return lastValueFrom(
        this.createCampaign(phoneNumber).pipe(
          map((response) => this.scheduleCampaignCreate(response.data.id)),
        ),
      );
    } catch (error) {}
  }

  createCampaign(phoneNumber: string) {
    return this.http.post<{ id: string }>(
      'campaigns',
      this.buildPayloadForCreatingCampaign(phoneNumber),
    );
  }

  async scheduleCampaignCreate(id: string) {
    try {
      return await lastValueFrom(
        this.http.post(`campaigns/${id}/schedules`, null).pipe(
          map(() => ({
            message: 'Message envoyé avec succès',
          })),
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  private buildPayloadForCreatingCampaign(phoneNumber: string) {
    return {
      ...CREATE_CAMPAIGN_PAYLOAD,
      sender: this.configService.get<{ sender: string }>('letextoconfig')
        .sender,
      message: this.configService.get<{ message: string }>('letextoconfig')
        .message,
      recipients: [{ phone: phoneNumber }],
    };
  }
}
