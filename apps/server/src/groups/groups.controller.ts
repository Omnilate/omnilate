import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger'
import { GroupBaseResponse, GroupCreateRequest, GroupInvitationCreateRequest, GroupJoinRequestReviewRequest, GroupRoleUpdateRequest, GroupUpdateRequest, UserBaseResponse, UserGroupResponse } from '@omnilate/schema'
import { GroupJoinInvitationAcceptedNotification, GroupJoinInvitationNotification, GroupJoinInvitationRejectedNotification, GroupJoinRequestAcceptedNotification, GroupJoinRequestNotification, GroupJoinRequestRejectedNotification } from '@omnilate/schema/dist/users/notifications/groups'

import { CurrentUserId } from '@/auth/current-user-id.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { NotificationsService } from '@/users/notifications/notifications.service'
import * as groupsUtils from '@/utils/groups'
import * as userUtils from '@/utils/users'

import { GroupsService } from './groups.service'

@Controller('groups')
export class GroupsController {
  constructor (
    private readonly groupsService: GroupsService,
    private readonly notificationsService: NotificationsService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: GroupCreateRequest })
  @ApiResponse({ type: GroupBaseResponse })
  async create (@Body() payload: GroupCreateRequest, @CurrentUserId() uid: number): Promise<GroupBaseResponse> {
    const group = await this.groupsService.create(uid, payload.name, payload.description)
    return groupsUtils.toBaseResponse(group)
  }

  @Get(':id')
  @ApiResponse({ type: GroupBaseResponse })
  async findOne (@Param('id') id: string): Promise<GroupBaseResponse> {
    const group = await this.groupsService.findOne(+id)
    return groupsUtils.toBaseResponse(group)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: GroupUpdateRequest })
  @ApiResponse({ type: GroupBaseResponse })
  async update (@Param('id') id: string, @Body() payload: GroupUpdateRequest): Promise<GroupBaseResponse> {
    const group = await this.groupsService.update(+id, payload)
    return groupsUtils.toBaseResponse(group)
  }

  @Get()
  @ApiResponse({ type: GroupCreateRequest, isArray: true })
  async searchGroups (@Query('keyword') keyword: string): Promise<GroupBaseResponse[]> {
    const result = await this.groupsService.searchByName({ keyword, page: 1, pageSize: 10 })
    return result.map((g) => groupsUtils.toBaseResponse(g))
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getMembers (@Param('id') id: string, @CurrentUserId() uid: number): Promise<UserGroupResponse[]> {
    const members = await this.groupsService.getMembers(+id)
    return members.map(userUtils.toGroupResponse)
  }

  @Get(':id/members/:uid')
  @UseGuards(JwtAuthGuard)
  async getMember (@Param('id') id: string, @Param('uid') uid: string): Promise<UserGroupResponse> {
    const member = await this.groupsService.getMember(+id, +uid)
    if (member == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    return userUtils.toGroupResponse(member)
  }

  @Put(':gid/members/:uid/role')
  @UseGuards(JwtAuthGuard)
  async updateMemberRole (
    @CurrentUserId() operatorId: number,
    @Param('gid') gid: string,
    @Param('uid') uid: string,
    @Body() payload: GroupRoleUpdateRequest
  ): Promise<UserGroupResponse[]> {
    const operator = await this.groupsService.getMember(+gid, operatorId)
    if (operator?.groups[0].role !== 'OWNER') {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN)
    }

    const members = await this.groupsService.updateMemberRole(+gid, +uid, payload.role)
    return members.map(userUtils.toGroupResponse)
  }

  @Delete(':gid/members/:uid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMember (
    @CurrentUserId() operatorId: number,
    @Param('gid') gid: string,
    @Param('uid') uid: string
  ): Promise<void> {
    const operator = await this.groupsService.getMember(+gid, operatorId)
    if (operator?.groups[0].role !== 'OWNER') {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN)
    }
    const member = await this.groupsService.getMember(+gid, +uid)
    if (member == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND)
    }
    if (member.groups[0].role === 'OWNER') {
      throw new HttpException('Cannot remove owner', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    await this.groupsService.removeMember(+gid, +uid)
  }
  // #region join

  @Post(':gid/join-requests')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async requestJoin (@Param('gid') gid: string, @CurrentUserId() uid: number): Promise<void> {
    const group = await this.groupsService.findOne(+gid)
    if (group == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND)
    }
    const isMember = await this.groupsService.isMember(+gid, uid)
    if (isMember) {
      throw new HttpException('Already a member', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const owners = await this.groupsService.getMembersOfRole(+gid, 'OWNER')

    await this.groupsService.createJoinRequest(+gid, uid)
    for (const owner of owners) {
      await this.notificationsService.create<GroupJoinRequestNotification>(
        owner.id,
        {
          type: 'GROUP_JOIN_REQUEST',
          content: 'NOTIFICATION.GROUP_JOIN_REQUEST',
          data: {
            groupId: +gid,
            userId: uid
          }
        }
      )
    }
  }

  @Patch(':gid/join-requests/:uid')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async modifyJoinRequest (
    @Param('gid') gid: string,
    @Param('uid') uid: string,
    @Body() payload: GroupJoinRequestReviewRequest
  ): Promise<void> {
    switch (payload.status) {
      case 'ACCEPTED': {
        await this.groupsService.acceptJoinRequest(+gid, +uid)
        await this.notificationsService.create<GroupJoinRequestAcceptedNotification>(
          +uid,
          {
            type: 'GROUP_JOIN_REQUEST_ACCEPTED',
            content: 'NOTIFICATION.GROUP_JOIN_REQUEST_ACCEPTED',
            data: {
              groupId: +gid
            }
          }
        )
        break
      }
      case 'REJECTED': {
        await this.groupsService.rejectJoinRequest(+gid, +uid)
        await this.notificationsService.create<GroupJoinRequestRejectedNotification>(
          +uid,
          {
            type: 'GROUP_JOIN_REQUEST_REJECTED',
            content: 'NOTIFICATION.GROUP_JOIN_REQUEST_REJECTED',
            data: {
              groupId: +gid
            }
          }
        )
        break
      }
      default: {
        throw new HttpException('Invalid Action', HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }
  }

  @Get(':gid/invited-users')
  @UseGuards(JwtAuthGuard)
  async getInvitedUsers (
    @CurrentUserId() operatorId: number,
    @Param('gid') gid: string
  ): Promise<UserBaseResponse[]> {
    const operator = await this.groupsService.getMember(+gid, operatorId)
    if (operator?.groups[0].role !== 'OWNER') {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN)
    }

    const users = await this.groupsService.getInvitedUsers(+gid)
    return users.map(userUtils.toBaseResponse)
  }

  @Post(':gid/invitations')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async inviteUser (
    @Param('gid') gid: string,
    @Body() payload: GroupInvitationCreateRequest,
    @CurrentUserId() uid: number
  ): Promise<void> {
    await this.groupsService.createInvitation(+gid, uid, payload.userId)
    await this.notificationsService.create<GroupJoinInvitationNotification>(
      payload.userId,
      {
        type: 'GROUP_JOIN_INVITATION',
        content: 'NOTIFICATION.GROUP_JOIN_INVITATION',
        data: {
          groupId: +gid,
          inviterId: uid,
          inviteeId: payload.userId
        }
      }
    )
  }

  @Get(':gid/invitations/:inviterId/to/:inviteeId/status')
  @UseGuards(JwtAuthGuard)
  async getInvitationStatus (
    @Param('gid') gid: string,
    @Param('inviterId') inviterId: string,
    @Param('inviteeId') inviteeId: string
  ): Promise<'ACCEPTED' | 'REJECTED' | 'PENDING'> {
    const invitation = await this.groupsService.getInvitation(+gid, +inviterId, +inviteeId)
    return invitation?.status as 'ACCEPTED' | 'REJECTED' | 'PENDING' ?? 'PENDING'
  }

  @Patch(':gid/invitations/:inviterId/to/:inviteeId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async modifyInvitation (
    @CurrentUserId() operatorId: number,
    @Param('gid') gid: string,
    @Param('inviterId') inviterId: string,
    @Param('inviteeId') inviteeId: string,
    @Body() payload: GroupJoinRequestReviewRequest
  ): Promise<void> {
    if (operatorId !== +inviteeId) {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN)
    }

    switch (payload.status) {
      case 'ACCEPTED': {
        await this.groupsService.acceptInvitation(+gid, +inviterId, +inviteeId)
        await this.notificationsService.create<GroupJoinInvitationAcceptedNotification>(
          +inviterId,
          {
            type: 'GROUP_JOIN_INVITATION_ACCEPTED',
            content: 'NOTIFICATION.GROUP_JOIN_INVITATION_ACCEPTED',
            data: {
              groupId: +gid,
              inviteeId: +inviteeId
            }
          }
        )
        break
      }
      case 'REJECTED': {
        await this.groupsService.rejectInvitation(+gid, +inviterId, +inviteeId)
        await this.notificationsService.create<GroupJoinInvitationRejectedNotification>(
          +inviterId,
          {
            type: 'GROUP_JOIN_INVITATION_REJECTED',
            content: 'NOTIFICATION.GROUP_JOIN_INVITATION_REJECTED',
            data: {
              groupId: +gid,
              inviteeId: +inviteeId
            }
          }
        )
        break
      }
      default: {
        throw new HttpException('Invalid Action', HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }
  }

  // #endregion
}
