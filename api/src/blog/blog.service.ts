import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UserType } from 'src/types';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schema/blog.schema';
import { Model } from 'mongoose';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {

constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument> ) {}

async create(user: UserType, dto:CreateBlogDto) {
    const newBlog = await this.blogModel.create({...dto, author:  user.id})

      return newBlog;
}

   async findAll(page:number, limit:number, user?: UserType) {
   //! 2 farklı işlem var 1. si gönderieri alma 
   //! 2. si total eleman sayısını alma
   //! ikisini de aynı anda yapması için Promise
    const [blogs, total] = await Promise.all([
    this.blogModel
    .find(user ? {author: user.id} : {} )
    .populate("author", "-password -__v")
    .populate("commentCount")
    .sort({createdAt: -1})
    .skip((page - 1)  * limit )
    .limit(limit),

    this.blogModel.countDocuments(user ? {author: user.id} : {}),
    ]);

    return {total, pages: Math.ceil(total/limit), blogs }
}

  async findById(id:string) {
    const blog = await this.blogModel
    .findById(id)
    .populate("author", "-password -__v")
    .populate("commentCount");

    if (!blog) {
        throw new NotFoundException()
    }
    return blog
  }

  async update(user: UserType, blogId: string, dto: UpdateBlogDto) {

    //! blog id ye göre blog u bul

    const blog = await this.blogModel.findById(blogId);
    

//! blogu bulamadıysa hata fırlat
if(!blog) {
    throw new NotFoundException("Bu gönderi bulunamadı")
}



    //! blog un yazarının kullanıcının id siyle aynı olup olmadığını kontrol et
    if (blog.author.toString()  !== user.id.toString() ) {
      throw new UnauthorizedException("Bu işlem için yetkiniz yok")
    } 

    //! blog u güncelle
    return await this.blogModel.findByIdAndUpdate(blogId,dto,{new:true});
}

async delete(user: UserType, blogId: string) {
    //! blogId ye göre blog u bul
    const blog = await this.blogModel.findById(blogId);

    //! blog u bulamadıysa hata fırlat
    if(!blog) {
        throw new NotFoundException("Bu Gönderi Bulunamadı");
    }

    //! blogun yazarının  kullanıcının id siyle aynı olup olmadığını kontrol et
    if (blog.author.toString()  !== user.id.toString() ) {
        throw new UnauthorizedException(
            "Bu gönderiyi güncellemek için yetkiniz yok"
        );
    }

    //! blogu sil
    return await  this.blogModel.findByIdAndDelete(blogId)
}

}
