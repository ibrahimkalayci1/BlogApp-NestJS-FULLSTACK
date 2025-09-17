import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { BlogModule } from 'src/blog/blog.module';

@Module({
  //! şemayı module e tanıtıyoruz
  imports : [
    MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]),
    BlogModule,
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
