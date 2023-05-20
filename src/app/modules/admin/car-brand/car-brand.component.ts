import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CarBrand } from 'app/core/car-brand/Car-brand';
import { CarBrandService } from 'app/core/car-brand/carbrand.service';

@Component({
  selector: 'app-car-brand',
  templateUrl: './car-brand.component.html',
  styleUrls: ['./car-brand.component.scss']
})

export class CarBrandComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: MatTableDataSource<CarBrand>;
  carBrandForm !: FormGroup;
  configForm: FormGroup;
  drawerOpened: boolean;
  dismissed: boolean = true;
  sideTittle: string = 'Agregar marca de auto';
  viewAlert:boolean = false;
  isEdit : boolean = false;
  buttonStatus : boolean = false;

  carBrands : CarBrand[];

  dialogMessage: string = 'Esta seguro que desea eliminarlo ? <span class="font-medium">Al eliminarlo se borraran todos los repuestos vinculados con este tipo.</span>';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('settingsDrawer', {static: true}) settingsDrawer: MatDrawer;

  constructor(
    private _formBuilder: FormBuilder,
    private _carBrandService: CarBrandService,
  ) {
  }
  ngOnInit(): void {
    // Create the car brand form
    this.carBrandForm = this._formBuilder.group({
        id          : [''],
        name        : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
    });

    // Get all de car brands

    this._carBrandService.getCarBrands().subscribe(
      next => {
        this.carBrands = next;
        this.dataSource = new MatTableDataSource(this.carBrands);
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

  toggleDrawer() {
    this.drawerOpened = !this.drawerOpened;
    if (!this.drawerOpened) {
      this.sideTittle = "Agregar marca de auto";
    }
  }

  edit(carBrand : CarBrand){
    this.sideTittle = "Editar marca de auto";
    this.toggleDrawer();

    this.carBrandForm.setValue({
      id: carBrand.id,
      name: carBrand.name,
    });
    
    // seteo el true para decir q estoy en edicion
    this.isEdit = true;
  }

  saveCarBrand(){
    if(this.isEdit){
      // Update
      this.buttonStatus = true;
      const cb = {
          id: this.carBrandForm.value.id,
          name: this.carBrandForm.value.name
      }
       this._carBrandService.updateCarBrand(cb).subscribe(
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
           console.log("Hola!");
           this.setDialog("Error de conexion con el servidor");
           this.isEdit = false;
         }
       );
    }else{
      // Create
    this.buttonStatus = true;
     const cb = {
        name: this.carBrandForm.value.name
     }
      this._carBrandService.createCarBrand(cb).subscribe(
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
