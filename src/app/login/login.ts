import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';
import { ToastContainerComponent } from '../component/toast-container.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
    selector: 'app-login',
    imports: [FormsModule, ToastContainerComponent, HttpClientModule],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    private toastService = inject(ToastService);

    loginData = {
        email: '',
        password: ''
    };

    constructor(private router: Router, private authService: AuthService) { }

    onSubmit() {
        this.authService.login(this.loginData.email, this.loginData.password)
            .subscribe({
                next: (response) => {
                    if (response)
                        this.router.navigate(['/dashboard']);
                    else
                        this.toastService.show('Usuário ou senha inválidos!', 'info');
                },
                error: (error) => {
                    this.toastService.show('Usuário ou senha inválidos!', 'error');
                }
            });
    }
}
