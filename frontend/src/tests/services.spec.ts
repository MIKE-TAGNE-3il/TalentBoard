import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JobService } from '../app/services/job.service';
import { AuthService } from '../app/services/auth.service';
import { Job } from '../app/models';

describe('JobService', () => {
  let service: JobService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobService]
    });
    service = TestBed.inject(JobService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch all jobs', () => {
    const mockJobs: Job[] = [
      {
        id: 1, title: 'DevOps Engineer', company: 'TechCorp',
        location: 'Paris', contractType: 'CDI', description: 'CI/CD expert',
        status: 'OPEN', recruiterName: 'Alice', applicationCount: 3,
        createdAt: '2026-01-01'
      }
    ];

    service.getJobs().subscribe(jobs => {
      expect(jobs.length).toBe(1);
      expect(jobs[0].title).toBe('DevOps Engineer');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/jobs');
    expect(req.request.method).toBe('GET');
    req.flush(mockJobs);
  });

  it('should fetch a single job by id', () => {
    const mockJob: Job = {
      id: 42, title: 'Angular Dev', company: 'WebCo',
      location: 'Lyon', contractType: 'INTERNSHIP', description: 'Front-end stage',
      status: 'OPEN', recruiterName: 'Bob', applicationCount: 0,
      createdAt: '2026-02-01'
    };

    service.getJob(42).subscribe(job => {
      expect(job.id).toBe(42);
      expect(job.contractType).toBe('INTERNSHIP');
    });

    const req = httpMock.expectOne('http://localhost:8080/api/jobs/42');
    expect(req.request.method).toBe('GET');
    req.flush(mockJob);
  });

  it('should send search params correctly', () => {
    service.getJobs('angular', 'Paris', 'CDI').subscribe();
    const req = httpMock.expectOne(r => r.url.includes('/api/jobs'));
    expect(req.request.params.get('keyword')).toBe('angular');
    expect(req.request.params.get('location')).toBe('Paris');
    req.flush([]);
  });
});

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should return false when not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return null user when not logged in', () => {
    expect(service.currentUser).toBeNull();
  });

  it('should clear user on logout', () => {
    localStorage.setItem('token', 'fake-token');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getToken()).toBeNull();
  });
});
