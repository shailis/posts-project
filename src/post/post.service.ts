import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Post } from '@prisma/client';
import { randomUUID } from 'crypto';
import { I18nService } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, ListPostDto, UpdatePostDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  private readonly defaultPage: number = 1;
  private readonly defaultPerPage: number = 10;

  async listPosts(
    userId: string,
    listPostDto: ListPostDto,
  ): Promise<{
    statusCode: HttpStatus;
    data: { posts: Partial<Post>[]; count: number };
    message: any;
  }> {
    try {
      const page = listPostDto.page ? listPostDto.page : this.defaultPage;
      const perPage = listPostDto.perPage
        ? listPostDto.perPage
        : this.defaultPerPage;

      const count: number = await this.prisma.post.count({
        where: { userId: userId },
      });

      let posts = [];
      if (count > 0) {
        posts = await this.prisma.post.findMany({
          where: {
            userId: userId,
          },
          select: {
            id: true,
            // userId: true,
            title: true,
            content: true,
            isPublished: true,
            createdAt: true,
          },
          // prettier-ignore
          skip: (page * perPage) - perPage,
          take: perPage,
          orderBy: {
            createdAt: 'desc',
          },
        });
      }

      return {
        statusCode: HttpStatus.OK,
        data: {
          posts,
          count,
        },
        message: this.i18n.t('post.ListRetrieved'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<{ statusCode: HttpStatus; data: Post; message: any }> {
    try {
      const post = await this.prisma.post.create({
        data: {
          id: randomUUID(),
          userId: userId,
          title: createPostDto.title,
          content: createPostDto.content,
          isPublished: createPostDto.isPublished,
          createdAt: new Date().getTime(),
        },
      });

      return {
        statusCode: HttpStatus.CREATED,
        data: post,
        message: this.i18n.t('post.CreateSuccessful'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<{ statusCode: HttpStatus; data: Post[]; message: any }> {
    try {
      const updatedPost = await this.prisma.user
        .update({
          where: {
            id: userId,
          },
          data: {
            posts: {
              update: {
                where: {
                  id: postId,
                },
                data: updatePostDto,
              },
            },
          },
        })
        .posts();

      return {
        statusCode: HttpStatus.OK,
        data: updatedPost,
        message: this.i18n.t('post.UpdateSuccessful'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async deletePost(
    userId: string,
    postId: string,
  ): Promise<{ statusCode: HttpStatus; data: any; message: any }> {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          posts: {
            delete: {
              id: postId,
            },
          },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: {},
        message: this.i18n.t('post.DeleteSuccessful'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  async getPost(
    userId: string,
    postId: string,
  ): Promise<{ statusCode: HttpStatus; data: Post; message: any }> {
    try {
      const post = await this.prisma.post.findFirst({
        where: {
          id: postId,
          userId: userId,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        data: post,
        message: this.i18n.t('post.InfoRetrieved'),
      };
    } catch (err) {
      this.handleError(err);
    }
  }

  handleError(err: { status: number; message: any }): void {
    Logger.error(err);
    throw new HttpException(err.message, err.status);
  }
}
