import { ChangeDetectionStrategy, Component, computed, Input, input, OnInit, signal } from "@angular/core";
import { ModalComponent } from "../modal/modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Job } from "./job";
import { Status } from "./status_enum";
import { inject } from '@angular/core';
import { Category } from "../category/category";
import { CategoryService } from "../../services/catergory.service";
import { ToastService } from "../../services/toast.service";
import { TaskService } from "../../services/task.service";
import { Project } from "../../dashboard/project";

@Component({
    selector: 'app-task',
    imports: [FormsModule, ModalComponent, ReactiveFormsModule],
    templateUrl: './task.component.html',
    styleUrl: './task.component.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Task implements OnInit {
    @Input() project?: Project;

    private toastService = inject(ToastService);

    constructor(private categoryService: CategoryService, private taskService: TaskService) { }

    projectData = {
        id: '',
        nameTask: '',
        description: ''
    };

    start = Status.Start;
    make = Status.Make;
    finish = Status.Finish;

    jobs = signal<Job[]>([]);
    categorys = signal<Category[]>([]);

    categorySelected: number = 0;

    ngOnInit(): void {
        this.getcategorys();
        this.getTasks();
    }

    getTasks() {
        this.taskService.getTaks(this.project?.id ?? -1).subscribe({
            next: (response) => {
                this.createList(response);
            },
            error: (error) => {
                this.toastService.show('Erro ao buscar tarefas!', 'error');
            }
        });
    }

    getcategorys() {
        this.categoryService.getCategorys().subscribe({
            next: (response) => {
                this.createListCategory(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }

    createList(list: any[]) {
        this.jobs.update(item => []);

        for (const job of list) {
            this.jobs.update(lista => [...lista, new Job(job['id'], job['name'], job['description'], job['id_category'], job['id_project'], job['status'])]);
        }
    }

    createListCategory(list: any[]) {
        this.categorys.update(item => []);
        this.categorySelected = 0;

        for (const category of list) {
            this.categorys.update(item => [...item, new Category(category['id'], category['name'], category['color'])]);
        }
    }

    onChange(valor: number) {
        this.categorySelected = valor;
    }


    open(modal: any, item: Job) {
        modal.abrir()
        this.projectData.id = item.id.toString();
        this.projectData.nameTask = item.name;
        this.projectData.description = item.description;
    }

    salvar(modal: any) {
        modal.fechar();
        this.taskService.saveTask(this.projectData.nameTask, this.projectData.description, this.categorySelected, this.project?.id ?? -1).subscribe({
            next: (response) => {
                this.toastService.show('Tarefa salva com sucesso!', 'info');
                this.getcategorys();
                this.getTasks();
                this.projectData.nameTask = '';
                this.projectData.description = '';
            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
    }

    update(modal: any) {
        const select = document.getElementById('status-select') as HTMLInputElement;
        modal.fechar();

        this.taskService.updateStatus(parseInt(this.projectData.id), parseInt(select.value)).subscribe({
            next: (response) => {
                this.toastService.show('Status atualizado com sucesso!', 'info');
                this.getcategorys();
                this.getTasks();
            },
            error: (error) => {
                this.toastService.show('erro ao atualizar status', 'error');
            }
        });
    }



    getStart = computed(() => this.jobs().filter((n) => n.status === Status.Start));

    getMake = computed(() => this.jobs().filter((n) => n.status === Status.Make));

    getFinish = computed(() => this.jobs().filter((n) => n.status === Status.Finish));
}