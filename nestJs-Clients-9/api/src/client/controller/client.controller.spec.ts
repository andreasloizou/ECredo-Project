import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientModule } from '../client.module';
import { ClientsService } from '../service/clients.service';
import { IClient } from '../models/client.interface';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../models/client.entity';

describe('ClientController', () => {
  let clientController: ClientController;
  let clientsService: ClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      imports: [ClientModule,
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
      providers: [ClientsService],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    clientsService = module.get<ClientsService>(ClientsService);
  });

  describe('createClient', () => {
    it('should create a client and return the created client', async () => {
      const mockClientData: IClient = {
        id: 1,
        name: 'TestClient',
      };
      jest.spyOn(clientsService, 'createClient').mockResolvedValueOnce(mockClientData);
      const result: IClient = await clientController.createClient(mockClientData);
      expect(result).toEqual(mockClientData);
    });
  });

  describe('getClients', () => {
    it('should return an array of clients', async () => {
      const mockClients: IClient[] = [
        { id: 1, name: 'Client1' },
        { id: 2, name: 'Client2' },
      ];
      jest.spyOn(clientsService, 'getAllClients').mockResolvedValueOnce(mockClients);
      const result: IClient[] = await clientController.getClients();
      expect(result).toEqual(mockClients);
    });
  });


  describe('getClientById', () => {
    it('should return a client by ID', async () => {
      const mockClientId = 1;
      const mockClient: IClient = { id: mockClientId, name: 'Client1' };
      jest.spyOn(clientsService, 'getClientById').mockResolvedValueOnce(mockClient);
      const result: IClient = await clientController.getClientById(mockClientId);
      expect(result).toEqual(mockClient);
    });
  });

  describe('updateClient', () => {
    it('should update a client and return the updated client', async () => {
      const mockClientId = 1;
      const mockClientData: IClient = { id: mockClientId, name: 'UpdatedClient' };
      const mockUpdatedClient: IClient = { ...mockClientData };
      jest.spyOn(clientsService, 'updateClient').mockResolvedValueOnce(mockUpdatedClient);
      const result: IClient = await clientController.updateClient(mockClientId, mockClientData);
      expect(result).toEqual(mockUpdatedClient);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      const mockClientId = 1;
      jest.spyOn(clientsService, 'deleteClient').mockResolvedValueOnce();
      await expect(clientController.deleteClient(mockClientId)).resolves.toBeUndefined();
    });
  });

});
