import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from '../../user/user.service';
import { User } from "src/user/schemas/user.schema";

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, "access") {
    constructor(
        private configService: ConfigService,
        private userService:UserService) {
        super({
            // tokeni cookie den al
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request?.cookies?.access_token,
            ]),

            // tokeni doğrulamak için kullanılacak anahtar
            secretOrKey:configService.get("JWT_ACCESS_SECRET") || "default",
        })
    }

    //
    async validate(payload:any){
        // payload ın içindeki kullanıcı id sine sahip kullanıcı mevcutmu
        const user = await this.userService.findById(payload.userId);

        // kullanıcı bulunamadıysa hata döndür
        if(!user) {
            throw new UnauthorizedException("Kullanıcı bulunamadı")
        }

        // kullanıcıyı döndür
        return user
    }
}