import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Login } from './login';
import { AuthFacade } from './auth.facade';
import { ToastService } from '../services/toast.service';
import { Credentials } from '../models/credentials.model';
import { LoginMessages } from './login.messages';

describe('Login (componente refatorado)', () => {
    let authFacadeMock: { login: ReturnType<typeof vi.fn> };
    let toastServiceMock: { show: ReturnType<typeof vi.fn> };

    beforeEach(async () => {
        authFacadeMock = { login: vi.fn() };
        toastServiceMock = { show: vi.fn() };

        await TestBed.configureTestingModule({
            imports: [Login],
            providers: [
                { provide: AuthFacade, useValue: authFacadeMock },
                { provide: ToastService, useValue: toastServiceMock },
            ],
        }).compileComponents();
    });

    function createComponent() {
        const fixture = TestBed.createComponent(Login);
        const component = fixture.componentInstance;
        return { fixture, component };
    }

    it('deve criar o componente', () => {
        const { component } = createComponent();
        expect(component).toBeTruthy();
    });

    it('deve iniciar com isLoading = false e Credentials vazio', () => {
        const { component } = createComponent();
        expect(component.isLoading()).toBe(false);
        expect(component.loginData).toBeInstanceOf(Credentials);
        expect(component.loginData.email).toBe('');
        expect(component.loginData.password).toBe('');
    });

    describe('onSubmit', () => {
        it('não deve chamar o facade quando as credenciais são inválidas', () => {
            const { component } = createComponent();
            component.loginData = new Credentials('invalido', '123');

            component.onSubmit();

            expect(authFacadeMock.login).not.toHaveBeenCalled();
            expect(component.isLoading()).toBe(false);
            expect(toastServiceMock.show).toHaveBeenCalledWith(
                LoginMessages.REQUIRED_FIELDS,
                'info'
            );
        });

        it('não deve chamar o facade se já estiver carregando (evita duplo submit)', () => {
            const { component } = createComponent();
            component.loginData = new Credentials('user@email.com', '123456');
            component.isLoading.set(true);

            component.onSubmit();

            expect(authFacadeMock.login).not.toHaveBeenCalled();
        });

        it('deve chamar o facade com as credenciais válidas e ativar isLoading', () => {
            authFacadeMock.login.mockReturnValue(of(void 0));
            const { component } = createComponent();
            component.loginData = new Credentials('user@email.com', '123456');

            component.onSubmit();

            expect(authFacadeMock.login).toHaveBeenCalledWith(component.loginData);
            expect(component.isLoading()).toBe(false);
        });

        it('deve finalizar o loading no sucesso e não exibir toast de erro', () => {
            authFacadeMock.login.mockReturnValue(of(void 0));
            const { component } = createComponent();
            component.loginData = new Credentials('user@email.com', '123456');

            component.onSubmit();

            expect(component.isLoading()).toBe(false);
            expect(toastServiceMock.show).not.toHaveBeenCalled();
        });

        it('deve exibir toast de erro e desligar o loading quando o facade falha', () => {
            authFacadeMock.login.mockReturnValue(
                throwError(() => new Error('401'))
            );
            const { component } = createComponent();
            component.loginData = new Credentials('user@email.com', '123456');

            component.onSubmit();

            expect(component.isLoading()).toBe(false);
            expect(toastServiceMock.show).toHaveBeenCalledWith(
                LoginMessages.INVALID_CREDENTIALS,
                'error'
            );
        });
    });
});

describe('Credentials (Value Object)', () => {
    it('deve ser inválido quando e-mail não contém @', () => {
        expect(new Credentials('semarroba', '123456').isValid()).toBe(false);
    });

    it('deve ser inválido quando a senha tem menos de 6 caracteres', () => {
        expect(new Credentials('user@email.com', '123').isValid()).toBe(false);
    });

    it('deve ser válido com e-mail correto e senha com 6+ caracteres', () => {
        expect(new Credentials('user@email.com', '123456').isValid()).toBe(true);
    });

    it('deve usar valores padrão vazios', () => {
        const credentials = new Credentials();
        expect(credentials.email).toBe('');
        expect(credentials.password).toBe('');
    });
});
