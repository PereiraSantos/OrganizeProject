import { Component, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
    selector: 'app-home',
    imports: [FormsModule, MatSidenavModule, MatToolbarModule,
        MatListModule, MatIconModule, RouterModule],
    templateUrl: './home.html',
    styleUrl: './home.css',


})
export class Home {
    private readonly router = inject(Router);
    private readonly session = inject(SessionService);

    handleClick() {
        this.session.clear();
        this.router.navigate(['login']);
    }
}