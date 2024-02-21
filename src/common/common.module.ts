import { Global, Module } from '@nestjs/common';
import { PUB_SUB } from './common.constants';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useValue: pubsub, // common 모듈이 생성되면 pubsub 이 생성된다.
    },
  ],
  exports: [PUB_SUB],
})
export class CommonModule {}
