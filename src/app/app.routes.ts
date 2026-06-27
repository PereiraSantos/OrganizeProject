import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { CategoryComponent } from './component/category/category.component';
import { Home } from './component/home/home';
import { loginGuard } from './middlewares/auth.guard';
import { routeGuard } from './middlewares/auth.guard';


export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login, canActivate: [loginGuard] },
    {
        path: '',
        component: Home,
        children: [
            { path: 'dashboard', component: Dashboard, canActivate: [routeGuard] },
            { path: 'category', component: CategoryComponent, canActivate: [routeGuard] },
        ]
    }
];


