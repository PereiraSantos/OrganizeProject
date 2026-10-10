import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { ToastContainerComponent } from '../component/toast-container.component';
import { Credentials } from '../models/credentials.model';
import { AuthFacade } from './auth.facade';
import { LoginMessages } from './login.messages';

@Component({
    selector: 'app-login',
    imports: [FormsModule, ToastContainerComponent, HttpClientModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    private readonly toastService = inject(ToastService);
    private readonly authFacade = inject(AuthFacade);
    private readonly destroyRef = inject(DestroyRef);

    /** Estado de UI: evita múltiplos submits e indica carregamento. */
    readonly isLoading = signal(false);

    /** Value Object com os dados do formulário + validação. */
    loginData = new Credentials();

    onSubmit(): void {
        if (this.isLoading() || !this.loginData.isValid()) {
            this.toastService.show(LoginMessages.REQUIRED_FIELDS, 'info');
            return;
        }

        this.isLoading.set(true);

        this.authFacade
            .login(this.loginData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.isLoading.set(false),
                error: () => {
                    this.isLoading.set(false);
                    this.toastService.show(LoginMessages.INVALID_CREDENTIALS, 'error');
                },
            });
    }
}

