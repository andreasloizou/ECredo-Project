import { Body, Controller, Delete, Get, Param, Put, Post } from '@nestjs/common';
import { ClientsService } from '../service/clients.service';
import { IClient } from '../models/client.interface';

@Controller('clients')
export class ClientController {

    constructor(private clientsService: ClientsService) { }

    @Post()
    async createClient(@Body() clientData: IClient): Promise<IClient> {
        return this.clientsService.createClient(clientData);
    }

    @Get()
    async getClients(): Promise<IClient[]> {
        return this.clientsService.getAllClients();
    }

    @Get(':id')
    async getClientById(@Param('id') id: number): Promise<IClient> {
        return this.clientsService.getClientById(id);
    }

    @Put(':id')
    async updateClient(@Param('id') id: number, @Body() clientData: IClient): Promise<IClient> {
        return this.clientsService.updateClient(id, clientData);
    }

    @Delete(':id')
    async deleteClient(@Param('id') id: number): Promise<void> {
        return this.clientsService.deleteClient(id);
    }

}
