import { CarBrand } from '../car-brand/Car-brand';
import { PartType } from '../part-type/part-type';
import { PartBrand } from '../part-brand/part-brand';
export interface Autopart {
    id: string;
    partType : PartType;
    partBrand: PartBrand;
    partModel: string;
    carBrand: CarBrand;
    serialNumber:string;
    stock: number;
    drawer: string;
    description: string;
    image: string ;
}