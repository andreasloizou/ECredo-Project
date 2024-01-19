import { Module } from '@nestjs/common';
import { ClientsService } from './service/clients.service';
import { ClientController } from './controller/client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './models/client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientEntity])
  ],
  providers: [ClientsService],
  controllers: [ClientController]
})
export class ClientModule {}
