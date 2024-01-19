import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from './clients.service';
import { ClientEntity } from '../models/client.entity';
import { IClient } from '../models/client.interface';
import { ClientModule } from '../client.module';
import { ClientController } from '../controller/client.controller';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException, NotFoundException } from '@nestjs/common';

describe('ClientService', () => {
  let clientsService: ClientsService;
  let controller: ClientController;
  let clientsRepository: Repository<ClientEntity>;

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
      providers: [ClientsService, {
        provide: getRepositoryToken(ClientEntity),
        useClass: Repository,
      }],
    }).compile();

    clientsService = module.get<ClientsService>(ClientsService);
    controller = module.get<ClientController>(ClientController);
    clientsRepository = module.get<Repository<ClientEntity>>(getRepositoryToken(ClientEntity));
  });

  describe('mapToIClient', () => {
    it('should map a ClientEntity to an IClient', () => {
      const clientEntity: ClientEntity = { id: 1, name: 'TestClient' } as ClientEntity;
      const result = clientsService.mapToIClient(clientEntity);
      const expected: IClient = { id: 1, name: 'TestClient' };
      expect(result).toEqual(expected);
    });
  });


  describe('createClient', () => {
    it('should create a client and return the created client', async () => {
      const mockClientData: IClient = { id: 1, name: 'NewClient' };
      const mockCreatedClient: IClient = { ...mockClientData };
      jest.spyOn(clientsRepository, 'save').mockResolvedValueOnce(Object.assign(new ClientEntity(), mockClientData));
      const result: IClient = await clientsService.createClient(mockClientData);
      expect(result).toEqual(mockCreatedClient);
    });

    it('should handle errors during client creation', async () => {
      jest.spyOn(clientsRepository, 'save').mockRejectedValueOnce(new Error('Test error'));
      await expect(clientsService.createClient({} as IClient)).rejects.toThrow(HttpException);
    });
  });

  describe('getAllClients', () => {
    it('should return an array of clients', async () => {
      const mockClients: IClient[] = [{ id: 1, name: 'Client1' }, { id: 2, name: 'Client2' }];
      jest.spyOn(clientsRepository, 'find').mockResolvedValueOnce(mockClients.map(clientData => Object.assign(new ClientEntity(), clientData)));
      const result: IClient[] = await clientsService.getAllClients();
      expect(result).toEqual(mockClients);
    });

    it('should handle errors during fetching clients', async () => {
      jest.spyOn(clientsRepository, 'find').mockRejectedValueOnce(new Error('Test error'));
      await expect(clientsService.getAllClients()).rejects.toThrow(HttpException);
    });
  });

  describe('getClientById', () => {
    it('should return a client by ID', async () => {
      const mockClientId = 1;
      const mockClient: IClient = { id: mockClientId, name: 'Client1' };
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValueOnce(Object.assign(new ClientEntity(), mockClient));
      const result: IClient = await clientsService.getClientById(mockClientId);
      expect(result).toEqual(mockClient);
    });

    it('should handle errors during fetching client by ID', async () => {
      jest.spyOn(clientsRepository, 'findOne').mockRejectedValueOnce(new Error('Test error'));
      await expect(clientsService.getClientById(1)).rejects.toThrow(HttpException);
    });

    it('should throw NotFoundException when client is not found', async () => {
      const mockClientId = 1;
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(clientsService.getClientById(mockClientId)).rejects.toThrow(HttpException);
    });
  });

  describe('updateClient', () => {
    it('should update a client and return the updated client', async () => {
      const mockClientId = 1;
      const mockClientData: IClient = { id: mockClientId, name: 'UpdatedClient' };
      const mockExistingClient: IClient = { id: mockClientId, name: 'ExistingClient' };
      const mockUpdatedClient: IClient = { ...mockExistingClient, ...mockClientData };
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValueOnce(Object.assign(new ClientEntity(), mockExistingClient));
      jest.spyOn(clientsRepository, 'save').mockResolvedValueOnce(Object.assign(new ClientEntity(), mockUpdatedClient));
      const result: IClient = await clientsService.updateClient(mockClientId, mockClientData);
      expect(result).toEqual(mockUpdatedClient);
    });

    it('should handle errors during updating client', async () => {
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValueOnce({} as ClientEntity);
      jest.spyOn(clientsRepository, 'save').mockRejectedValueOnce(new Error('Test error'));
      await expect(clientsService.updateClient(1, {} as IClient)).rejects.toThrow(HttpException);
    });

    it('should throw NotFoundException when client is not found', async () => {
      const mockClientId = 1;
      const mockClientData: IClient = { id: mockClientId, name: 'UpdatedClient' };
      jest.spyOn(clientsRepository, 'findOne').mockResolvedValueOnce(undefined);
      await expect(clientsService.updateClient(mockClientId, mockClientData)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', async () => {
      const mockClientId = 1;
      jest.spyOn(clientsRepository, 'delete').mockResolvedValueOnce({ affected: 1 } as any);
      await expect(clientsService.deleteClient(mockClientId)).resolves.toBeUndefined();
    });

    it('should handle errors during deleting client', async () => {
      jest.spyOn(clientsRepository, 'delete').mockRejectedValueOnce(new Error('Test error'));
      await expect(clientsService.deleteClient(1)).rejects.toThrow(HttpException);
    });

    it('should throw NotFoundException when client is not found', async () => {
      const mockClientId = 1;
      jest.spyOn(clientsRepository, 'delete').mockResolvedValueOnce({ affected: 0 } as any);
      await expect(clientsService.deleteClient(mockClientId)).rejects.toThrow(HttpException);
    });
  });


});
