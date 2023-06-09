import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DashboardService } from 'app/core/dashboard/dashboard.service';
import { AutopartService } from 'app/core/autopart/autopart.service';
import { Dashboard } from 'app/core/dashboard/dashboard';
import { Autopart } from 'app/core/autopart/autopart';

@Component({
    selector       : 'project',
    templateUrl    : './project.component.html',
    styleUrls      : ['./project.component.scss'],
    encapsulation  : ViewEncapsulation.None
})
export class ProjectComponent implements OnInit, OnDestroy
{
    // Mis variables
    dashboardData   : Dashboard[] = null;
    autoPartsData   !: Dashboard ;
    partTypesData   !: Dashboard ;
    partBrandData   !: Dashboard ;
    carBrandData    !: Dashboard ;

    autoParts       !: Autopart[];

    viewAlert:boolean = false;
    dialogMessage !: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _dashboardService: DashboardService,
        private _autopartService: AutopartService
    )
    {
    }
    ngOnInit(): void
    {
        // Get the data
        this._dashboardService.getDashboardCounts().subscribe(
            next => {
              this.dashboardData = next;
              this.setData();
            },
            error => {
              if (error.status == 500) {
                this.setDialog(error.error.msg);
              }
              this.setDialog("Error de conexion con el servidor");
            }
        );

        // Get all autoparts
        this._autopartService.getLastUpdatesAutoparts().subscribe(
            next => {
            this.autoParts = next;
            },
            error => {
            if (error.status == 500) {
                this.setDialog(error.error.msg);
            }
            this.setDialog("Error de conexion con el servidor");
            }
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Metodo que muestra el dialog para mostrar el error
    setDialog (message: string){
        this.dialogMessage = message;
        this.viewAlert= true;
    }

    private setData() {
        this.dashboardData.forEach(element => {
            switch (element.model) {
                case 'Repuestos':
                    this.autoPartsData = element;
                    break;
                case 'Tipos de repuestos':
                    this.partTypesData = element;
                    break;
                case 'Marcas de repuestos':
                    this.partBrandData = element;
                    break;
                case 'Marcas de autos':
                    this.carBrandData = element;
                    break;
                default:
                    break;
            }
        });
    }
}