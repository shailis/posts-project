import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { HandleErrorClass } from 'src/common/helpers/handle-error.helper';

@Module({
  controllers: [PostController],
  providers: [PostService, HandleErrorClass],
})
export class PostModule {}
