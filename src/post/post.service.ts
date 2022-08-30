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

  /**
   * @function listPosts
   * @description Lists all posts of the user
   * @author Shaili S.
   * @module post
   * @param userId
   * @param listPostDto
   * @returns { statusCode: HttpStatus; data: { posts: Partial<Post>[]; count: number }; message: any; }
   */
  async listPosts(
    userId: string,
    listPostDto: ListPostDto,
  ): Promise<{
    statusCode: HttpStatus;
    data: { posts: Partial<Post>[]; count: number };
    message: any;
  }> {
    Logger.log('post-->post.service.ts-->listPosts');
    try {
      const page = listPostDto.page ? listPostDto.page : this.defaultPage;
      const perPage = listPostDto.perPage
        ? listPostDto.perPage
        : this.defaultPerPage;

      // get total post count of user
      const count: number = await this.prisma.post.count({
        where: { userId: userId },
      });

      let posts = [];

      // if count > 0, find posts of user
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

  /**
   * @function createPost
   * @description Creates post for user
   * @author Shaili S.
   * @module post
   * @param userId
   * @param createPostDto
   * @returns { statusCode: HttpStatus; data: Post; message: any }
   */
  async createPost(
    userId: string,
    createPostDto: CreatePostDto,
  ): Promise<{ statusCode: HttpStatus; data: Post; message: any }> {
    Logger.log('post-->post.service.ts-->createPost');

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

  /**
   * @function updatePost
   * @description Updates a post for user
   * @author Shaili S.
   * @module post
   * @param userId
   * @param postId
   * @param updatePostDto
   * @returns { statusCode: HttpStatus; data: Post[]; message: any }
   */
  async updatePost(
    userId: string,
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<{ statusCode: HttpStatus; data: Post[]; message: any }> {
    Logger.log('post-->post.service.ts-->updatePost');
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

  /**
   * @function deletePost
   * @description Deletes a post of user
   * @author Shaili S.
   * @module post
   * @param userId
   * @param postId
   * @returns { statusCode: HttpStatus; data: any; message: any }
   */
  async deletePost(
    userId: string,
    postId: string,
  ): Promise<{ statusCode: HttpStatus; data: any; message: any }> {
    Logger.log('post-->post.service.ts-->deletePost');
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

  /**
   * @function getPost
   * @description Gets a user post info
   * @author Shaili S.
   * @module post
   * @param userId
   * @param postId
   * @returns { statusCode: HttpStatus; data: Post; message: any }
   */
  async getPost(
    userId: string,
    postId: string,
  ): Promise<{ statusCode: HttpStatus; data: Post; message: any }> {
    Logger.log('post-->post.service.ts-->getPost');
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

  /**
   * @function handleError
   * @description Handles error of catch block
   * @author Shaili S.
   * @module post
   * @param err
   */
  handleError(err: { status: number; message: any }): void {
    throw new HttpException(err.message, err.status);
  }
}
