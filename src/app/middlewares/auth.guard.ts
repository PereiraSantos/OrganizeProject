import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SessionService } from '../services/session.service';

export const loginGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const session = inject(SessionService);

    if (session.isAuthenticated()) {
        if (router.url != '/dashboard') router.navigate(['dashboard']);
        return false;
    }

    return true;
};

export const routeGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const session = inject(SessionService);

    if (!session.isAuthenticated()) {
        if (router.url != '/login') router.navigate(['login']);
        return false;
    }

    return true;
};
