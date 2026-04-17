import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/catergory.service';
import { ToastService } from '../../services/toast.service';
import { Category } from './category';
import { Color } from './color';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category',
    imports: [FormsModule, CommonModule],
    templateUrl: './category.html',
    styleUrl: './category.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class CategoryComponent implements OnInit {
    private toastService = inject(ToastService);

    constructor(private categoryService: CategoryService) { }

    projectData = {
        id: '',
        nameTask: '',
        description: ''
    };

    selectedColor: Color = new Color(0, 'red', false);
    categorys = signal<Category[]>([]);
    colors = signal<Color[]>([
        new Color(0, '#DC143C', true),
        new Color(1, '#ffff25', false),
        new Color(2, '#00FF7F', false),
        new Color(3, '#FFA500', false),
        new Color(4, '#6A5ACD', false),
    ]);

    ngOnInit(): void {
        this.getcategorys();
    }

    salvar() {
        this.categoryService.saveCategory(this.projectData.nameTask, this.selectedColor.id).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.getcategorys();
                this.projectData.nameTask = '';
            },
            error: (error) => {
                this.toastService.show('Projetos ou senha inválidos!', 'error');
            }
        });
    }

    getcategorys() {
        this.categoryService.getCategorys().subscribe({
            next: (response) => {
                this.createList(response);
            },
            error: (error) => {
                this.toastService.show('Usuário ou senha inválidos!', 'error');
            }
        });
    }

    createList(list: any[]) {
        this.categorys.update(item => []);

        for (const category of list) {
            this.categorys.update(item => [...item, new Category(category['id'], category['name'], category['color'])]);
        }

    }

    selectColor(value: Color) {
        this.selectedColor = value;

        this.colors.update(colors =>
            colors.map(cor => ({
                ...cor,
                selected: cor.id === value.id
            }))
        );
    }

    getStyle(cor: Color) {
        return {
            'background-color': cor.cor,
            border: cor.selected ? '1px solid ' + cor.cor : 'none'
        };
    }


}