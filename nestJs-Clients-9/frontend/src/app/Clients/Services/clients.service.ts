import { Injectable } from '@angular/core';
import { IClient } from '../../Common/Model/Client';
import { HttpRequestsService } from '../../Common/Services/http-requests.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private clientSubject = new BehaviorSubject<IClient>({ id: -1, name: '' });
  editedClient$ = this.clientSubject.asObservable();

  constructor(private httpService: HttpRequestsService) { }

  getAllClients(): Observable<IClient[]> {
    return this.httpService.getAll();
  }

  getSingleClient(id: number): Observable<IClient> {
    return this.httpService.getById(id);
  }

  addClient(clientData: any): Observable<IClient> {
    return this.httpService.add(clientData);
  }

  updateClient(clientId: number, updatedData: any): Observable<IClient> {
    return this.httpService.update(clientId, updatedData);
  }

  deleteClient(clientId: number): Observable<IClient> {
    return this.httpService.delete(clientId);
  }

  routeClient(client: IClient): void {
    this.clientSubject.next(client);
  }

}
