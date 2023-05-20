/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';


const menu: FuseNavigationItem[] = [
    {
        id   : 'autopart',
        title: 'Repuestos',
        type : 'basic',
        icon : 'heroicons_outline:search',
        link : '/autopart'
    },
    {
        id   : 'part-type',
        title: 'Tipos de repuestos',
        type : 'basic',
        icon : 'settings',
        link : '/part-type'
    },
    {
        id   : 'part-brand',
        title: 'Marcas de repuestos',
        type : 'basic',
        icon : 'settings',
        link : '/part-brand'
    },
    {
        id   : 'car-brand',
        title: 'Marcas de Autos',
        type : 'basic',
        icon : 'directions_car_filled',
        link : '/car-brand'
    }
];

export const defaultNavigation: FuseNavigationItem[] = menu;
export const compactNavigation: FuseNavigationItem[] = menu;
export const futuristicNavigation: FuseNavigationItem[] = menu;
export const horizontalNavigation: FuseNavigationItem[] = menu;
