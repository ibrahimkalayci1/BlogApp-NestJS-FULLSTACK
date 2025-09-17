import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({
    timestamps : true,
    toJSON: {
        virtuals:true, 
        transform: (doc,ret:Record<string,any>) => {
            
      delete ret?._id;
    },
    },
    toObject:{
        virtuals:true,
        transform:(doc,ret: Record<string,any>) => {
            
            delete ret?._id;
        },
    },
    versionKey:false,
})



export class Blog{
    @Prop({required:true})
    title:string;
  
    @Prop({required:true})
    content:string;
  
    @Prop()
    photo:string;

    @Prop()
    tags:string[];
  
    @Prop({required:true, type:mongoose.Schema.Types.ObjectId, ref: "User"})
    author:string;

    
    commentCount?: number;
}


   const BlogSchema = SchemaFactory.createForClass(Blog);
   // transform _id to id
  // BlogSchema.virtual("id").get(function  () {
   // return this._id.toString(); 
 // } );

  //! comment a istek atmadan find all veya find own a istek atıldığında da 
  //! comment sayılarını görebilmek için kullanıcıyı tekrar client tarfına istek atmak
  //! zorunda bırakmamak için yapolan sorguya yorum verilerini de dahil etmek için 
  //! virtual property mongo da gördük-- farklı bir şemada tutulan verileri ekleme
  //! blog değeri yorumun hangi gönderi için atıldığını gösteriyot
  //! blog un id değeri ile yorumun blog: yazısı karşısındaki değeri eşleşiyorsa o yorumu almam gerek
  //! mevcut blogun id si , yorumun blog değerine karşılık geliyosa bu bloga atılmış yorumdur diyerekten git onu say diyoruz
  //! blogservice de populate et 
  BlogSchema.virtual("commentCount", {

      ref: "Comment",
      localField: "_id",
      foreignField: "blog",
      count: true,

  });

  export type BlogDocument = Blog & Document;

export {BlogSchema};

