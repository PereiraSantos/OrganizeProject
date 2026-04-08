import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ColorCategory } from '../../enum/color_category';
import { CategoryService } from '../../services/catergory.service';
import { ToastService } from '../../services/toast.service';
import { Category } from './category';

@Component({
    selector: 'app-category',
    imports: [FormsModule],
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

    colorCategory = ColorCategory;
    selectedColor: ColorCategory = ColorCategory.Red;
    categorys = signal<Category[]>([]);

    ngOnInit(): void {
        this.getcategorys();
    }

    salvar() {
        this.categoryService.saveCategory(this.projectData.nameTask, this.selectedColor).subscribe({
            next: (response) => {
                this.toastService.show('Projetos salvo com sucesso!', 'info');
                this.getcategorys();
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

    selectColor(value: ColorCategory) {
        this.selectedColor = value;
    }


}