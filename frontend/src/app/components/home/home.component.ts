import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero -->
    <div class="text-center py-5 my-3 rounded-4" style="background: linear-gradient(135deg, #1a3a5c, #2e6da4);">
      <h1 class="display-4 fw-bold text-white mb-3">🎯 TalentBoard</h1>
      <p class="lead text-light mb-4">La plateforme qui connecte talents et recruteurs</p>
      <a routerLink="/jobs" class="btn btn-light btn-lg me-3 fw-semibold">Voir les offres</a>
      <button *ngIf="!authService.isLoggedIn()" class="btn btn-outline-light btn-lg"
              (click)="showModal = true">Rejoindre</button>
    </div>

    <!-- Stats -->
    <div class="row text-center my-5">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm p-4 rounded-4">
          <div class="display-6 fw-bold text-primary">500+</div>
          <div class="text-muted">Offres disponibles</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm p-4 rounded-4">
          <div class="display-6 fw-bold text-success">1200+</div>
          <div class="text-muted">Candidats inscrits</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm p-4 rounded-4">
          <div class="display-6 fw-bold text-warning">300+</div>
          <div class="text-muted">Entreprises partenaires</div>
        </div>
      </div>
    </div>

    <!-- Auth Modal -->
    <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content rounded-4 shadow">
          <div class="modal-header border-0 pb-0">
            <ul class="nav nav-tabs border-0">
              <li class="nav-item">
                <button class="nav-link" [class.active]="tab==='login'" (click)="tab='login'">Connexion</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" [class.active]="tab==='register'" (click)="tab='register'">Inscription</button>
              </li>
            </ul>
            <button class="btn-close ms-auto" (click)="showModal=false"></button>
          </div>
          <div class="modal-body pt-2">
            <div *ngIf="error" class="alert alert-danger py-2">{{ error }}</div>

            <!-- Login -->
            <form *ngIf="tab==='login'" (ngSubmit)="login()">
              <div class="mb-3">
                <input type="email" class="form-control" placeholder="Email" [(ngModel)]="loginForm.email" name="email" required>
              </div>
              <div class="mb-3">
                <input type="password" class="form-control" placeholder="Mot de passe" [(ngModel)]="loginForm.password" name="password" required>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                {{ loading ? 'Connexion...' : 'Se connecter' }}
              </button>
            </form>

            <!-- Register -->
            <form *ngIf="tab==='register'" (ngSubmit)="register()">
              <div class="row mb-3">
                <div class="col">
                  <input class="form-control" placeholder="Prénom" [(ngModel)]="registerForm.firstName" name="firstName" required>
                </div>
                <div class="col">
                  <input class="form-control" placeholder="Nom" [(ngModel)]="registerForm.lastName" name="lastName" required>
                </div>
              </div>
              <div class="mb-3">
                <input type="email" class="form-control" placeholder="Email" [(ngModel)]="registerForm.email" name="email" required>
              </div>
              <div class="mb-3">
                <input type="password" class="form-control" placeholder="Mot de passe (6 min)" [(ngModel)]="registerForm.password" name="password" required>
              </div>
              <div class="mb-3">
                <select class="form-select" [(ngModel)]="registerForm.role" name="role">
                  <option value="CANDIDATE">Candidat</option>
                  <option value="RECRUITER">Recruteur</option>
                </select>
              </div>
              <button type="submit" class="btn btn-success w-100" [disabled]="loading">
                {{ loading ? 'Inscription...' : "S'inscrire" }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  showModal = false;
  tab = 'login';
  loading = false;
  error = '';

  loginForm = { email: '', password: '' };
  registerForm = { email: '', password: '', firstName: '', lastName: '', role: 'CANDIDATE' };

  constructor(public authService: AuthService, private router: Router) {}

  login() {
    this.loading = true; this.error = '';
    this.authService.login(this.loginForm).subscribe({
      next: () => { this.showModal = false; this.router.navigate(['/jobs']); },
      error: (e) => { this.error = e.error || 'Identifiants incorrects'; this.loading = false; }
    });
  }

  register() {
    this.loading = true; this.error = '';
    this.authService.register(this.registerForm).subscribe({
      next: () => { this.showModal = false; this.router.navigate(['/jobs']); },
      error: (e) => { this.error = e.error || 'Erreur lors de l\'inscription'; this.loading = false; }
    });
  }
}
