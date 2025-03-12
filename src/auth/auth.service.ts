import { Injectable,UnauthorizedException,NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}
    async login(email:string,password:string){
        const user = await this.usersService.findOneByEmail(email);
        if(!user) throw new NotFoundException();
        if(!await compare(password,user.password)){
            throw new UnauthorizedException();
        }
        const payload = {sub:user.id,email:user.email};
        return {
            token: this.jwtService.sign(payload)
        }
    }
}
