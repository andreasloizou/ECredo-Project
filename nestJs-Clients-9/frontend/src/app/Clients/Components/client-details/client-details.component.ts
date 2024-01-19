import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { IClient } from '../../../Common/Model/Client';
import { ClientsService } from '../../Services/clients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.scss'
})
export class ClientDetailsComponent implements OnInit {

  displayedColumns = ['id', 'name', 'action1', 'action2'];
  dataSource: MatTableDataSource<IClient>;

  clients: IClient[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientService: ClientsService, private router: Router) {
    this.dataSource = new MatTableDataSource();
    this.paginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
    this.sort = new MatSort();
  }

  ngOnInit(): void {
    this.initializeClientsGrid();
  }

  private initializeClientsGrid() {
    this.clientService.getAllClients().subscribe(clients => {
      this.dataSource = new MatTableDataSource(clients);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }),
      (error: any) => {
        console.error('Error loading clients', error);
      };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  routeToAddNewClient() {
    this.addEditClient({ id: -1, name: '' });
  }

  addEditClient(editedClient: IClient) {
    this.clientService.routeClient(editedClient);
    this.router.navigate(['/add-edit-client']);
  }

  deleteClient(selectedContactId: number) {
    this.clientService.deleteClient(selectedContactId).subscribe(result => {
      this.initializeClientsGrid();
    }),
      (error: any) => {
        console.error('Error deleting client', error);
      };
  }

}
