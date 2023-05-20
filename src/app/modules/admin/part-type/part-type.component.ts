import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartTypeService } from 'app/core/part-type/parttype.service';
import { PartType } from 'app/core/part-type/part-type';


@Component({
  selector: 'app-part-type',
  templateUrl: './part-type.component.html',
  styleUrls: ['./part-type.component.scss']
})
export class PartTypeComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  dataSource: MatTableDataSource<PartType>;
  partTypeForm !: FormGroup;
  drawerOpened: boolean;
  sideTittle: string = 'Agregar tipo de repuesto';
  configForm: FormGroup;
  dismissed:boolean = true;
  viewAlert:boolean = false;
  isEdit: boolean = false;
  buttonStatus: boolean = false;

  dialogMessage: string = 'Esta seguro que desea eliminarlo ? <span class="font-medium">Al eliminarlo se borraran todos los repuestos vinculados con este tipo.</span>';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _formBuilder: FormBuilder,
    private _partTypeService: PartTypeService
  ) {    
  }
  ngOnInit(): void {
    // Create the task form
    this.partTypeForm = this._formBuilder.group({
        id          : [''],
        name        : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    });
    
    // Get all de part types
    this._partTypeService.getPartTypes().subscribe(
      next => {
        this.dataSource = new MatTableDataSource(next);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        if (error.status == 500) {
          this.setDialog(error.error.msg);
        }
        this.setDialog("Error de conexion con el servidor");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  savePartBrand(){
    if(this.isEdit){
      // Update
      this.buttonStatus = true;
      const pt = {
          id: this.partTypeForm.value.id,
          name: this.partTypeForm.value.name
      }
 
       this._partTypeService.updatePartType(pt).subscribe(
         next => {
           this.dataSource.data.push(next); // Esto es para que se vea en la tabla
           this.dataSource._updateChangeSubscription(); // Esto es para que se vea en la tabla
           this.toggleDrawer();
           this.dismissed = false; // Esto muestra la alerta, hacer que lo haga despues de que se registra en la db
           this.buttonStatus = false;
           this.isEdit = false;  
         },
         error => {
           if (error.status == 500) {
             this.setDialog(error.error.msg);
           }
           this.setDialog("Error de conexion con el servidor");
           this.isEdit = false; 
         }
       );
    }else{
      // Create
      this.buttonStatus = true;
     const pt = {
        name: this.partTypeForm.value.name
     }

      this._partTypeService.createPartType(pt).subscribe(
        next => {
          this.dataSource.data.push(next); // Esto es para que se vea en la tabla
          this.dataSource._updateChangeSubscription(); // Esto es para que se vea en la tabla
          this.toggleDrawer();
          this.dismissed = false; // Esto muestra la alerta, hacer que lo haga despues de que se registra en la db
          this.buttonStatus = false;
        },
        error => {
          if (error.status == 500) {
            this.setDialog(error.error.msg);
          }
          this.setDialog("Error de conexion con el servidor");
        }
      );
    }
  }

  edit(partType : PartType){
    this.isEdit = true;
    this.sideTittle = "Editar tipo de repuesto";
    this.toggleDrawer();

    this.partTypeForm.setValue({
      id: partType.id,
      name: partType.name
    });
  }

  toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
    if (!this.drawerOpened) {
      this.sideTittle = "Agregar tipo de repuesto";
    }
  }

  getViewAlert(){
    return this.viewAlert;
  }

  // Metodo que muestra el dialog para mostrar el error
  setDialog (message: string){
    this.dialogMessage = message;
    this.viewAlert= true;
    this.toggleDrawer();
  }
}