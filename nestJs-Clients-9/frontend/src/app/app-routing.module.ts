import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditClientComponent } from './Clients/Components/add-edit-client/add-edit-client.component';
import { ClientDetailsComponent } from './Clients/Components/client-details/client-details.component';

const routes: Routes = [
  {
    path: 'Clients',
    loadChildren: () => import('./Clients/clients.module').then(m => m.ClientsModule)
  },
  {
    path: 'app-client-details',
    component: ClientDetailsComponent
  },
  {
    path: 'add-edit-client',
    component: AddEditClientComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
