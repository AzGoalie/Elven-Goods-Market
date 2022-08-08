import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideFirebaseApp} from '@angular/fire/app';
import {connectFirestoreEmulator, getFirestore, provideFirestore} from '@angular/fire/firestore';
import {initializeApp} from 'firebase/app';

import {environment} from '../../environments/environment';
import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => {
          const firestore = getFirestore();
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          return firestore;
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
