import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">Offres d'emploi</h2>
      <span class="badge bg-primary fs-6">{{ jobs.length }} offres</span>
    </div>

    <!-- Filtres -->
    <div class="card border-0 shadow-sm rounded-4 p-3 mb-4">
      <div class="row g-2">
        <div class="col-md-5">
          <input class="form-control" placeholder="🔍 Poste, entreprise..." [(ngModel)]="keyword" (keyup.enter)="search()">
        </div>
        <div class="col-md-3">
          <input class="form-control" placeholder="📍 Ville..." [(ngModel)]="location" (keyup.enter)="search()">
        </div>
        <div class="col-md-2">
          <select class="form-select" [(ngModel)]="contractType">
            <option value="">Contrat</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="INTERNSHIP">Stage</option>
            <option value="APPRENTICESHIP">Alternance</option>
            <option value="FREELANCE">Freelance</option>
          </select>
        </div>
        <div class="col-md-2 d-grid">
          <button class="btn btn-primary" (click)="search()">Rechercher</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div *ngIf="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <!-- Jobs -->
    <div *ngIf="!loading">
      <div *ngFor="let job of jobs" class="card border-0 shadow-sm rounded-4 mb-3 hover-card">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="fw-bold mb-1">{{ job.title }}</h5>
              <p class="text-muted mb-2">🏢 {{ job.company }} &nbsp;•&nbsp; 📍 {{ job.location }}</p>
              <div class="d-flex gap-2 flex-wrap">
                <span class="badge rounded-pill" [class]="getBadgeClass(job.contractType)">
                  {{ job.contractType }}
                </span>
                <span *ngIf="job.salary" class="badge bg-light text-dark rounded-pill">💰 {{ job.salary }}</span>
              </div>
            </div>
            <div class="text-end">
              <div class="text-muted small mb-2">{{ job.createdAt | date:'dd/MM/yyyy' }}</div>
              <a [routerLink]="['/jobs', job.id]" class="btn btn-outline-primary btn-sm rounded-pill px-3">
                Voir l'offre →
              </a>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="jobs.length === 0" class="text-center py-5 text-muted">
        <div class="display-6">😕</div>
        <p>Aucune offre trouvée</p>
      </div>
    </div>
  `,
  styles: [`.hover-card:hover { transform: translateY(-2px); transition: transform .2s; }`]
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  keyword = '';
  location = '';
  contractType = '';

  constructor(private jobService: JobService) {}

  ngOnInit() { this.search(); }

  search() {
    this.loading = true;
    this.jobService.getJobs(this.keyword || undefined, this.location || undefined, this.contractType || undefined)
      .subscribe({ next: jobs => { this.jobs = jobs; this.loading = false; }, error: () => this.loading = false });
  }

  getBadgeClass(type: string): string {
    const map: Record<string, string> = {
      CDI: 'bg-success', CDD: 'bg-warning text-dark',
      INTERNSHIP: 'bg-info text-dark', APPRENTICESHIP: 'bg-primary', FREELANCE: 'bg-secondary'
    };
    return map[type] || 'bg-secondary';
  }
}
