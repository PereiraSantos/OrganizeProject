import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './login/login';
import { CategoryComponent } from './component/category/category.component';
import { Home } from './component/home/home';

export const routes: Routes = [

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },

    {
        path: '',
        component: Home,
        children: [
            { path: 'dashboard', component: Dashboard },
            { path: 'category', component: CategoryComponent },
        ]
    }
];
