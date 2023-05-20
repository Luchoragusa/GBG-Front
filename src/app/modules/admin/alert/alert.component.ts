import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  configForm: FormGroup;

  @Input() message: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  ngOnInit(): void {

    // Parametro del dialog
    this.configForm = this._formBuilder.group({
      title      : 'Información',
      message    : this.message,
      icon       : this._formBuilder.group({
          show : true,
          name : 'heroicons_outline:exclamation',
          color: "warn"
      }),
      actions    : this._formBuilder.group({
        "confirm": {
          "show": true,
          "label": "Continuar",
          "color": "primary"
        },
        "cancel": {
          "show": false,
          "label": "Cancel"
        }
      }),
      dismissible: true
    });

    // Open the dialog and save the reference of it
    const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
  }
}
