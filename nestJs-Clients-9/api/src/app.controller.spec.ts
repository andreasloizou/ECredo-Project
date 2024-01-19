import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientModule } from './client/client.module';
import { ClientController } from './client/controller/client.controller';
import { ClientsService } from './client/service/clients.service';
import { AppModule } from './app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './client/models/client.entity';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController, ClientController],
      imports: [AppModule, ClientModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'root',
          database: 'clientsdb',
          synchronize: true,
          dropSchema: true,
          entities: [ClientEntity],
        }),
        TypeOrmModule.forFeature([ClientEntity])
      ],
      providers: [AppService, ClientsService],
      exports: [ClientsService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
