import { Status } from "./status_enum";

export class Job {
    id: number;
    name: string;
    description: string;
    idCategory: number;
    status: Status;

    constructor(id: number, name: string, description: string, idCategory: number, status: Status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.idCategory = idCategory;
        this.status = status;
    }
}