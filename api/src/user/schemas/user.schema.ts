import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import bcrypt from "bcrypt"
import { Document } from "mongoose";
@Schema({  timestamps : true,
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
export class User {
    
    @Prop({required:true, unique:true})
    username:string
    
    @Prop({required:true, unique:true})
    email:string


    @Prop({required:true, unique:true})
    password:string

}
  
//! class üzerinden şema oluşturma
const UserSchema = SchemaFactory.createForClass(User);

//! şemanın tipi
export type UserDocument = User & Document;
 

//! kullanıcıyı kaydetmeden önce şifre değiştiyse şifresini hashle
//! her kaydetme işleminden önce 
UserSchema.pre("save", async function (next) {
    try {
        //! değişmediyse elleme
        if(!this.isModified("password")) return next();
          
        //! değiştiyse önce saltla sonra hashle
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});


export {UserSchema};