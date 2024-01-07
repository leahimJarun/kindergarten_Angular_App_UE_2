export interface Kindergarden {
    id: number;
    name: string;
    address: string;
    betreiber: string;
    typ: Typ,
    imagePath: string,
  }

  export enum Typ {
      privat = 1,
      oeffentlich = 2,
  }