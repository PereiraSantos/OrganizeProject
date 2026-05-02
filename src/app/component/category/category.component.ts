import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/catergory.service';
import { ToastService } from '../../services/toast.service';
import { Category } from './category';
import { Color } from './color';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category',
    imports: [FormsModule, CommonModule, ReactiveFormsModule],
    templateUrl: './category.html',
    styleUrl: './category.css',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit {
    private toastService = inject(ToastService);


    selectedColor: Color = new Color(0, 'red', false);
    categorys = signal<Category[]>([]);
    colors = signal<Color[]>([
        new Color(0, '#DC143C', true),
        new Color(1, '#ffff25', false),
        new Color(2, '#00FF7F', false),
        new Color(3, '#FFA500', false),
        new Color(4, '#6A5ACD', false),
    ]);

    form!: FormGroup;

    constructor(private categoryService: CategoryService, public fb: FormBuilder) { }

    ngOnInit(): void {
        this.initForm();
        this.getcategorys();
    }

    initForm() {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.maxLength(100)]],
        });
    }

    salvar() {
        if (this.form.valid) {
            this.categoryService.saveCategory(this.form.value.title, this.selectedColor.id).subscribe({
                next: (response) => {
                    this.toastService.show('Projetos salvo com sucesso!', 'info');
                    this.getcategorys();

                    this.form.get('title')!.reset();
                },
                error: (error) => {
                    this.toastService.show('Projetos ou senha inválidos!', 'error');
                }
            });
        }
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

    getStyleColor(category: Category) {
        let color: any = this.colors().filter(p => p.id === category.color);

        return {
            'background-color': color[0].cor
        };
    }


}