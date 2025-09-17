import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { AccessGuard } from 'src/auth/guards/access-guard';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import type {Request as RequestType} from "express"
import {  UserType } from 'src/types';


@Controller('blog')
export class BlogController {
    constructor(private BlogService: BlogService){}

    @UseGuards(AccessGuard)
    @Post()
    create(@Request() req: RequestType, @Body() dto:CreateBlogDto ) {
        return this.BlogService.create(req.user as  UserType,dto)
    }

//! parseıntpipe aldıgımız parametrenin veri tipini stringden number a çevirir
    @Get()
    findAll(
        @Query("limit",  new DefaultValuePipe(10), ParseIntPipe  )  limit: number, 
        @Query("page",    new DefaultValuePipe(1), ParseIntPipe  )  page: number,
          ){
            return this.BlogService.findAll(page,limit);
          } 
    


    @UseGuards(AccessGuard)
    @Get("own")
    findOwn(
        @Request()  req:RequestType,
        @Query("limit",  new DefaultValuePipe(10), ParseIntPipe  )  limit: number, 
        @Query("page",    new DefaultValuePipe(1), ParseIntPipe  )  page: number,
    ) {
   return this.BlogService.findAll(page, limit, req.user)
     
}


     @Get(":id")
    findById(@Param("id") id: string ) {
        return this.BlogService.findById(id)
    }


    //! ahmetin bilgisini mehmet güncelleyememeli
    //! o yizden request içinden kullanıcı bilgisi
    //! güncellenecek olan blog un id si
    //!ve değerleri
    @UseGuards(AccessGuard)
    @Patch(":id")
    update(
        @Request()req : RequestType,
        @Param("id") id:string , 
        @Body() dto:UpdateBlogDto ,) {
            return this.BlogService.update(req.user as UserType, id,dto)
        }
 




    @UseGuards(AccessGuard)
    @Delete(":id")
    delete(@Request()  req: RequestType, @Param("id")  id:string ) {
        return this.BlogService.delete(req.user as UserType, id);
    }
}


