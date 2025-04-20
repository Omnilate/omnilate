import { Module } from '@nestjs/common'

import { YGateway } from './y.gateway'

@Module({
  providers: [YGateway]
})
export class YModule {}
