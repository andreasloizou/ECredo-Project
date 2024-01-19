import { Component, OnInit, Output } from '@angular/core';
import { IClient } from '../../../Common/Model/Client';
import { Router } from '@angular/router';
import { ClientsService } from '../../Services/clients.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-client',
  templateUrl: './add-edit-client.component.html',
  styleUrl: './add-edit-client.component.scss'
})
export class AddEditClientComponent implements OnInit {

  userForm: FormGroup = new FormGroup({});

  @Output() client: IClient;

  constructor(private clientsService: ClientsService, private formBuilder: FormBuilder, private router: Router) {
    this.client = { id: -1, name: '' };
  }

  ngOnInit(): void {
    this.clientsService.editedClient$.subscribe(editedClient => {
      this.checkClientAction(editedClient);
      this.initForm();
    })
  }

  private checkClientAction(editedClient: IClient) {
    if (editedClient.id > -1) {
      this.client = editedClient;
    }
    else if (editedClient.id == -1) {
      this.client = { id: -1, name: '' };
    } else {
      console.log('NO CLIENT FOUND ! client: ', this.client);
    }
  }

  private initForm() {
    if (this.client.id == -1) {
      this.userForm = this.formBuilder.group({
        id: [''],
        name: ['', [Validators.required, Validators.minLength(3)]]
      });
    } else {
      this.userForm = this.formBuilder.group({
        id: ['', [Validators.required]],
        name: ['', [Validators.required, Validators.minLength(3)]]
      });
    }
  }

  cancelAction() {
    this.client = { id: -1, name: '' };
    this.initForm();
    this.router.navigate(['/']);
  }

  createNewClient(newClientData: any): void {
    this.clientsService.addClient(newClientData).subscribe({
      next: response => {
        this.router.navigate(['/']);
      },
      error: e => console.log('addEditComponent addClient() e: ', e),
    });
  }

  editClient(client: IClient) {
    this.clientsService.updateClient(client.id, client)
      .subscribe((editedClient: IClient) => {
        this.router.navigate(['/']);
      }),
      (error: any) => {
        console.error('Error updating client', error);
      };
  }

}
