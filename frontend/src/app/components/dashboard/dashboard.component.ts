import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../services/application.service';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { Application, Job } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <h2 class="fw-bold mb-4">Mon espace — {{ authService.currentUser?.firstName }}</h2>

    <!-- Candidat : mes candidatures -->
    <div *ngIf="!authService.isRecruiter()">
      <h5 class="mb-3">📋 Mes candidatures</h5>
      <div *ngIf="applications.length === 0" class="text-muted">Aucune candidature pour le moment.</div>
      <div *ngFor="let app of applications" class="card border-0 shadow-sm rounded-4 mb-3 p-3">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <div class="fw-semibold">{{ app.jobTitle }}</div>
            <div class="text-muted small">{{ app.company }} • {{ app.appliedAt | date:'dd/MM/yyyy' }}</div>
          </div>
          <span class="badge rounded-pill fs-6" [class]="getStatusClass(app.status)">
            {{ getStatusLabel(app.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Recruteur : créer une offre -->
    <div *ngIf="authService.isRecruiter()">
      <div class="row">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h5 class="fw-bold mb-3">➕ Publier une offre</h5>
            <div *ngIf="jobCreated" class="alert alert-success">Offre publiée !</div>
            <form (ngSubmit)="createJob()">
              <input class="form-control mb-2" placeholder="Intitulé du poste *" [(ngModel)]="newJob.title" name="title" required>
              <input class="form-control mb-2" placeholder="Entreprise *" [(ngModel)]="newJob.company" name="company" required>
              <input class="form-control mb-2" placeholder="Localisation *" [(ngModel)]="newJob.location" name="location" required>
              <select class="form-select mb-2" [(ngModel)]="newJob.contractType" name="contractType">
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="INTERNSHIP">Stage</option>
                <option value="APPRENTICESHIP">Alternance</option>
                <option value="FREELANCE">Freelance</option>
              </select>
              <input class="form-control mb-2" placeholder="Salaire (optionnel)" [(ngModel)]="newJob.salary" name="salary">
              <textarea class="form-control mb-2" rows="4" placeholder="Description *" [(ngModel)]="newJob.description" name="description" required></textarea>
              <textarea class="form-control mb-3" rows="3" placeholder="Compétences requises" [(ngModel)]="newJob.requirements" name="requirements"></textarea>
              <button type="submit" class="btn btn-success w-100">Publier l'offre</button>
            </form>
          </div>
        </div>
        <div class="col-md-6">
          <h5 class="fw-bold mb-3">📌 Mes offres publiées</h5>
          <div *ngFor="let job of myJobs" class="card border-0 shadow-sm rounded-4 mb-2 p-3">
            <div class="fw-semibold">{{ job.title }}</div>
            <div class="text-muted small">{{ job.applicationCount }} candidature(s) • {{ job.createdAt | date:'dd/MM/yyyy' }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  applications: Application[] = [];
  myJobs: Job[] = [];
  jobCreated = false;
  newJob = { title: '', company: '', location: '', contractType: 'CDI', description: '', requirements: '', salary: '' };

  constructor(
    public authService: AuthService,
    private applicationService: ApplicationService,
    private jobService: JobService
  ) {}

  ngOnInit() {
    if (!this.authService.isRecruiter()) {
      this.applicationService.getMyApplications().subscribe(a => this.applications = a);
    } else {
      this.jobService.getJobs().subscribe(j => this.myJobs = j);
    }
  }

  createJob() {
    this.jobService.createJob(this.newJob).subscribe({
      next: (job) => {
        this.jobCreated = true;
        this.myJobs.unshift(job);
        this.newJob = { title: '', company: '', location: '', contractType: 'CDI', description: '', requirements: '', salary: '' };
      }
    });
  }

  getStatusClass(status: string): string {
    const m: Record<string, string> = { PENDING: 'bg-warning text-dark', REVIEWED: 'bg-info text-dark', ACCEPTED: 'bg-success', REJECTED: 'bg-danger' };
    return m[status] || 'bg-secondary';
  }

  getStatusLabel(status: string): string {
    const m: Record<string, string> = { PENDING: '⏳ En attente', REVIEWED: '👀 En cours', ACCEPTED: '✅ Accepté', REJECTED: '❌ Refusé' };
    return m[status] || status;
  }
}
