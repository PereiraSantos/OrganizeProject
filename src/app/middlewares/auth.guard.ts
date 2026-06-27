import { Injectable, inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = sessionStorage.getItem('auth_token');

    if (token) {
        if (router.url != '/dashboard') router.navigate(['dashboard']);
        return false;
    }

    return true;
};

export const routeGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = sessionStorage.getItem('auth_token');

    if (token == null || token == undefined) {
        if (router.url != '/login') router.navigate(['login']);
        return false;
    }

    return true;
};
