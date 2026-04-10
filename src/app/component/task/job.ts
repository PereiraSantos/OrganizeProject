import { Status } from "./status_enum";

export class Job {
    id: number;
    name: string;
    description: string;
    idCategory: number;
    idProject: number;
    status: Status;

    constructor(id: number, name: string, description: string, idCategory: number, idProject: number, status: Status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.idCategory = idCategory;
        this.idProject = idProject;
        this.status = status;
    }
}