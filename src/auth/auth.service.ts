import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private jwtService: JwtService,
    ) { }

    async login(email: string, password: string) {
        // 1. Buscar el usuario por email
        const usuario = await this.usuarioRepository.findOne({ where: { email } });
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 2. Comparar la contraseña con el hash guardado
        const coincide = await bcrypt.compare(password, usuario.password);
        if (!coincide) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // 3. Generar el token
        const payload = { sub: usuario.id, email: usuario.email };
        const token = await this.jwtService.signAsync(payload);

        return { access_token: token };
    }
    async register(email: string, password: string) {
        // Hashear la contraseña antes de guardar
        const hash = await bcrypt.hash(password, 10);

        const usuario = this.usuarioRepository.create({ email, password: hash });
        await this.usuarioRepository.save(usuario);

        return { mensaje: 'Usuario creado correctamente' };
    }
}