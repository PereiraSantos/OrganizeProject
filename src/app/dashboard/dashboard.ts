import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ModalComponent } from '../component/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { Project } from './project';
import { Task } from '../component/task/task.component';
import { ProjectService } from '../services/project.service';
import { ToastService } from '../services/toast.service';


@Component({
    selector: 'app-dashboard',
    imports: [ModalComponent, FormsModule, Task],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Dashboard implements OnInit {

    private toastService = inject(ToastService);

    constructor(private projectService: ProjectService) { }

    isShowTask: boolean = false;
    project?: Project;


    ngOnInit(): void {
        this.getProjects();
    }

    projects = signal<Project[]>([]);

    projectData = {
        nameProject: '',
        description: ''
    };

    createList(list: any[]) {
        this.projects.update(item => []);

        for (const project of list) {
            this.projects.update(item => [...item, new Project(project['id'], project['name'], project['description'])]);
        }

    }

    salvar(modal: any) {
        modal.fechar();
        if (this.projectData.nameProject === '') return;

        this.projectService.saveProjects(this.projectData.nameProject, this.projectData.description).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.getProjects();
            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
    }

    getProjects() {
        this.projectService.getProjects().subscribe({
            next: (response) => {
                this.createList(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }

    showTask(value?: Project) {
        this.project = value;
        this.isShowTask = !this.isShowTask;
    }

}
