import { Route } from '@angular/router';
import { ProjectComponent } from 'app/modules/admin/dashboard/project.component';
import { ProjectResolver } from 'app/modules/admin/dashboard/project.resolvers';

export const projectRoutes: Route[] = [
    {
        path     : '',
        component: ProjectComponent,
        resolve  : {
            data: ProjectResolver
        }
    }
];
