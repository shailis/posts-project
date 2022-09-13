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
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';
import { ListPostDto, UpdatePostDto } from './dto';
import { CreatePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  listPosts(@GetUser('id') userId: string, @Query() listPostDto: ListPostDto) {
    Logger.log('post-->post.controller.ts-->listPosts');
    return this.postService.listPosts(userId, listPostDto);
  }

  @Post('create')
  createPost(
    @GetUser('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    Logger.log('post-->post.controller.ts-->createPost');
    return this.postService.createPost(userId, createPostDto);
  }

  @Patch('update')
  updatePost(
    @GetUser('id') userId: string,
    @Query('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    Logger.log('post-->post.controller.ts-->updatePost');
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete('delete')
  deletePost(@GetUser('id') userId: string, @Body('id') postId: string) {
    Logger.log('post-->post.controller.ts-->deletePost');
    return this.postService.deletePost(userId, postId);
  }

  @Get()
  getPost(@GetUser('id') userId: string, @Query('id') postId: string) {
    Logger.log('post-->post.controller.ts-->getPost');
    return this.postService.getPost(userId, postId);
  }
}
