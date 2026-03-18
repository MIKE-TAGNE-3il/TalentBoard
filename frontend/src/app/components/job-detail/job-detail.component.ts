import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';
import { AuthService } from '../../services/auth.service';
import { Job } from '../../models';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div *ngIf="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

    <div *ngIf="job && !loading">
      <a routerLink="/jobs" class="btn btn-link ps-0 mb-3">← Retour aux offres</a>

      <div class="card border-0 shadow rounded-4 p-4 mb-4">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h2 class="fw-bold mb-1">{{ job.title }}</h2>
            <p class="text-muted fs-5">🏢 {{ job.company }} &nbsp;•&nbsp; 📍 {{ job.location }}</p>
            <div class="d-flex gap-2">
              <span class="badge bg-primary rounded-pill">{{ job.contractType }}</span>
              <span *ngIf="job.salary" class="badge bg-light text-dark rounded-pill">💰 {{ job.salary }}</span>
            </div>
          </div>
          <div class="text-muted small">Publiée le {{ job.createdAt | date:'dd/MM/yyyy' }}</div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm rounded-4 p-4 mb-3">
            <h5 class="fw-bold mb-3">Description du poste</h5>
            <p style="white-space: pre-line">{{ job.description }}</p>
          </div>
          <div *ngIf="job.requirements" class="card border-0 shadow-sm rounded-4 p-4">
            <h5 class="fw-bold mb-3">Compétences requises</h5>
            <p style="white-space: pre-line">{{ job.requirements }}</p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4 p-4 sticky-top" style="top:80px">
            <h6 class="fw-bold mb-3">Postuler à cette offre</h6>

            <div *ngIf="!authService.isLoggedIn()" class="alert alert-info small">
              Connectez-vous pour postuler
            </div>

            <div *ngIf="success" class="alert alert-success small">{{ success }}</div>
            <div *ngIf="error" class="alert alert-danger small">{{ error }}</div>

            <form *ngIf="authService.isLoggedIn() && !success" (ngSubmit)="apply()">
              <div class="mb-3">
                <label class="form-label small fw-semibold">Lettre de motivation</label>
                <textarea class="form-control" rows="6" [(ngModel)]="coverLetter" name="coverLetter"
                          placeholder="Décrivez votre motivation..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary w-100" [disabled]="applying">
                {{ applying ? 'Envoi...' : 'Envoyer ma candidature' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  coverLetter = '';
  applying = false;
  success = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private applicationService: ApplicationService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.jobService.getJob(id).subscribe({ next: j => { this.job = j; this.loading = false; }, error: () => this.loading = false });
  }

  apply() {
    if (!this.job) return;
    this.applying = true; this.error = '';
    this.applicationService.apply({ jobId: this.job.id, coverLetter: this.coverLetter }).subscribe({
      next: () => { this.success = '✅ Candidature envoyée avec succès !'; this.applying = false; },
      error: (e) => { this.error = e.error?.message || 'Erreur lors de la candidature'; this.applying = false; }
    });
  }
}
