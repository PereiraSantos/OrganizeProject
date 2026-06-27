import { Component, } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-home',
    imports: [FormsModule, MatSidenavModule, MatToolbarModule,
        MatListModule, MatIconModule, RouterModule],
    templateUrl: './home.html',
    styleUrl: './home.css',


})
export class Home {

    constructor(private router: Router) { }

    handleClick() {
        sessionStorage.removeItem('auth_token');
        this.router.navigate(['login']);
    }
}