import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from '../models/client.entity';
import { Repository } from 'typeorm';
import { IClient } from '../models/client.interface';

@Injectable()
export class ClientsService {

    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientsRepository: Repository<ClientEntity>
    ) { }

    mapToIClient(clientEntity: ClientEntity): IClient {
        return {
            id: clientEntity.id,
            name: clientEntity.name,
        };
    }

    async createClient(clientData: IClient): Promise<IClient> {
        try {
            const createdClient = await this.clientsRepository.save(clientData);
            return this.mapToIClient(createdClient);
        } catch (error) {
            throw new HttpException('Error(500) creating client', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllClients(): Promise<IClient[]> {
        try {
            const clients = await this.clientsRepository.find();
            return clients.map(this.mapToIClient);
        } catch (error) {
            throw new HttpException('Error(500) fetching clients', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getClientById(id: number): Promise<IClient> {
        try {
            const client = await this.clientsRepository.findOne({ where: { id } });
            if (!client) {
                throw new NotFoundException(`Client with ID ${id} not found`);
            }
            return this.mapToIClient(client);
        } catch (error) {
            throw new HttpException('Error(500) fetching client by ID', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateClient(id: number, clientData: IClient): Promise<IClient> {
        try {
            const existingClient = await this.clientsRepository.findOne({ where: { id } });
            if (!existingClient) {
                throw new NotFoundException(`Client with ID ${id} not found`);
            }
            const updatedClient = await this.clientsRepository.save({ ...existingClient, ...clientData });
            return this.mapToIClient(updatedClient);
        } catch (error) {
            throw new HttpException('Error(500) updating client', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteClient(id: number): Promise<void> {
        try {
            const result = await this.clientsRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException(`Client with ID ${id} not found`);
            }
        } catch (error) {
            throw new HttpException('Error(500) deleting client', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
