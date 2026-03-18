import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold fs-4" routerLink="/">
          🎯 TalentBoard
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs" routerLinkActive="active">Offres</a>
            </li>
            <li class="nav-item" *ngIf="authService.isLoggedIn()">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Mon espace</a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" *ngIf="!authService.isLoggedIn()">
              <a class="nav-link btn btn-outline-light px-3" routerLink="/" fragment="login">Connexion</a>
            </li>
            <li class="nav-item dropdown" *ngIf="authService.isLoggedIn()">
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                👤 {{ authService.currentUser?.firstName }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><span class="dropdown-item-text text-muted small">{{ authService.currentUser?.role }}</span></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" (click)="logout()">Déconnexion</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
  logout() { this.authService.logout(); }
}
