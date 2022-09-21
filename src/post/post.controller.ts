import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Patch,
  Delete,
  Logger,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';
import { ListPostDto, UpdatePostDto } from './dto';
import { CreatePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('')
  listPosts(@GetUser('id') userId: string, @Query() listPostDto: ListPostDto) {
    Logger.log('post-->post.controller.ts-->listPosts');
    return this.postService.listPosts(userId, listPostDto);
  }

  @Post('')
  createPost(
    @GetUser('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    Logger.log('post-->post.controller.ts-->createPost');
    return this.postService.createPost(userId, createPostDto);
  }

  @Patch(':id')
  updatePost(
    @GetUser('id') userId: string,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    Logger.log('post-->post.controller.ts-->updatePost');
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete()
  deletePost(@GetUser('id') userId: string, @Body('id') postId: string) {
    Logger.log('post-->post.controller.ts-->deletePost');
    return this.postService.deletePost(userId, postId);
  }

  @Get(':id')
  getPost(@GetUser('id') userId: string, @Param('id') postId: string) {
    Logger.log('post-->post.controller.ts-->getPost');
    return this.postService.getPost(userId, postId);
  }
}
