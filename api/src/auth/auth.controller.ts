import { Body, Controller, HttpCode, HttpStatus, Post ,Response,Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type {Response as ResponseType, Request as RequestType } from "express"
import { AuthGuard } from '@nestjs/passport';
import { PassThrough } from 'stream';



@Controller('auth')
export class AuthController {
    constructor(private AuthService: AuthService) {}



@HttpCode(HttpStatus.CREATED)
@Post("register")
async register(@Body()  dto:RegisterDto) {
    const user = await this.AuthService.register(dto);

    const {password, ...rest} =user
    
    return  rest;
}

@Post("login")
async  login(
    @Body() dto: LoginDto, 
    @Response({passthrough:true})  res:ResponseType,
) {
    //! servis katmanı ile iletişime geçip servis katmanındaki login i çağır
    const {user,accessToken,refreshToken} = 
    await this.AuthService.login(dto);

    res.cookie("access_token", accessToken, {
        httpOnly:true,
        maxAge:1000 * 60 * 60 *24,
    });

    res.cookie("refresh_token", refreshToken, {
        httpOnly:true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return user;
}

@HttpCode(HttpStatus.OK)
 @UseGuards(AuthGuard("refresh"))
@Post("refresh-token")
refresh(
    @Request() req:any,
    @Response({passthrough:true}) res: ResponseType,
 ) {
    const accessToken = this.AuthService.generateAccessToken(
        req.user?.id as string, 
        req.user?.username as string, 
    );

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 *24,
  });


    return {message: "Yeni access token oluşturuldu"};
}

@HttpCode(HttpStatus.OK)
@UseGuards(AuthGuard("access"))
@Post("logout")
async logout(@Response({passthrough:true}) res:ResponseType ) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return {message: "Çıkış yapıldı"};
}

}
