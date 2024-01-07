import { Kindergarden } from "./Kindergarden";

export interface Child {
    id: string;
    name: string;
    birthDate: string,
    registerDate: string,
    kindergardenId: number
  }

  export interface ChildResponse {
    id: string;
    name: string;
    birthDate: string,
    registerDate: string,
    kindergarden: Kindergarden,
    kindergardenId: number
  }