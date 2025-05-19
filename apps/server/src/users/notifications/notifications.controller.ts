import { Controller, Delete, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common'
import { NotificationResponse } from '@omnilate/schema'

import { CurrentUserId } from '@/auth/current-user-id.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { BigIntParam } from '@/misc/bigint-param.decorator'
import * as notificationUtils from '@/utils/notifications'

import { NotificationsService } from './notifications.service'

@Controller('users/me/notifications')
export class NotificationsController {
  constructor (private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll (@CurrentUserId() uid: number): Promise<NotificationResponse[]> {
    const notifications = await this.notificationsService.findAll(uid)
    return notifications.map(notificationUtils.toResponse)
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne (@BigIntParam('id') id: bigint): Promise<NotificationResponse> {
    const notification = await this.notificationsService.findOne(id)
    return notificationUtils.toResponse(notification)
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead (@BigIntParam('id') id: bigint): Promise<NotificationResponse> {
    const notification = await this.notificationsService.markAsRead(id)
    return notificationUtils.toResponse(notification)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove (@BigIntParam('id') id: bigint): Promise<void> {
    await this.notificationsService.remove(id)
  }
}
