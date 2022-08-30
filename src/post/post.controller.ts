import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { GetUser } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';
import { ListPostDto, UpdatePostDto } from './dto';
import { CreatePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('list')
  listPosts(@GetUser('id') userId: string, @Query() listPostDto: ListPostDto) {
    return this.postService.listPosts(userId, listPostDto);
  }

  @Post('create')
  createPost(
    @GetUser('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Patch('update')
  updatePost(
    @GetUser('id') userId: string,
    @Query('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete('delete')
  deletePost(@GetUser('id') userId: string, @Body('id') postId: string) {
    return this.postService.deletePost(userId, postId);
  }

  @Get()
  getPost(@GetUser('id') userId: string, @Query('id') postId: string) {
    return this.postService.getPost(userId, postId);
  }
}
