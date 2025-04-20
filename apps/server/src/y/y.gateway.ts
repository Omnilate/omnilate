import { IncomingMessage } from 'http'

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { Server } from 'ws'
import type { WebSocket } from 'ws'

import { setupWSConnection } from './y.utils'

@WebSocketGateway({ path: '/yjs', cors: { origin: '*' } })
export class YGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  handleConnection (connection: WebSocket, request: IncomingMessage): void {
    // We can handle authentication of user like below

    // const token = getCookie(request?.headers?.cookie, 'auth_token');
    // const ERROR_CODE_WEBSOCKET_AUTH_FAILED = 4000;
    // if (!token) {
    //   connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    // } else {
    //   const signedJwt = this.authService.verifyToken(token);
    //   if (!signedJwt) connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    //   else {
    //     const docName = getCookie(request?.headers?.cookie, 'roomName');
    //     setupWSConnection(connection, request, { ...(docName && { docName }) });
    //   }
    // }

    const params = new URLSearchParams(request.url?.split('?')[1])
    const docName = params.get('roomname') ?? 'default'
    setupWSConnection(connection, request, { docName })
  }

  handleDisconnect (): void {}
}
