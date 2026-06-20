import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { UserOrmEntity } from './infrastructure/persistence/typeorm/user.orm-entity';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/user.typeorm-repository';
import { USER_REPOSITORY } from './application/ports/user-repository.port';

import { AuthService } from './application/auth.service';
import { UserService } from './application/user.service';
import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'flora-tech-default-secret'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '60m') as any 
        },
      }),
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
    AuthService,
    UserService,
    JwtStrategy,
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
