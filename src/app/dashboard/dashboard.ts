import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ModalComponent } from '../component/modal/modal.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from './project';
import { Task } from '../component/task/task.component';
import { ProjectService } from '../services/project.service';
import { ToastService } from '../services/toast.service';


@Component({
    selector: 'app-dashboard',
    imports: [ModalComponent, FormsModule, Task, ReactiveFormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Dashboard implements OnInit {

    private toastService = inject(ToastService);

    constructor(private projectService: ProjectService, public fb: FormBuilder) { }

    isShowTask: boolean = false;
    project?: Project;
    form!: FormGroup;

    ngOnInit(): void {
        this.initForm();
        this.getProjects();
    }

    projects = signal<Project[]>([]);


    initForm() {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            description: ['', [Validators.required, Validators.maxLength(100)]],
        });
    }

    salvar(modal: any) {
        if (this.form.valid) {
            modal.fechar();

            this.projectService.saveProjects(this.form.value.name, this.form.value.description).subscribe({
                next: (response) => {
                    this.toastService.show('Projetos salvo com sucesso!', 'info');
                    this.getProjects();
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
        }
    }

    getProjects() {
        this.clear();

        this.projectService.getProjects().subscribe({
            next: (response) => {
                this.createList(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }

    createList(list: any[]) {
        for (const project of list) {
            this.projects.update(item => [...item, new Project(project['id'], project['name'], project['description'])]);
        }

    }

    showTask(value?: Project) {
        this.project = value;
        this.isShowTask = !this.isShowTask;
    }

    clear() {
        this.projects.update(item => []);
        this.form.get('name')!.reset();
        this.form.get('description')!.reset();
    }

}
