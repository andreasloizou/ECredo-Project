import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { AddEditClientComponent } from './Components/add-edit-client/add-edit-client.component';
import { ClientDetailsComponent } from './Components/client-details/client-details.component'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ClientsService } from './Services/clients.service';
import { HttpRequestsService } from '../Common/Services/http-requests.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    ClientDetailsComponent,
    AddEditClientComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MatToolbarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  exports: [],
  providers: [
    ClientsService,
    HttpRequestsService
  ]
})
export class ClientsModule { }
