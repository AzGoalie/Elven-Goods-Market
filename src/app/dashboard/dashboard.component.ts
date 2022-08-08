import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {collection, collectionData, CollectionReference, Firestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

export interface StockInfo {
  name: string;
  symbol: string;
  price: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  displayedColumns: string[] = ['name', 'price'];
  stocks: Observable<StockInfo[]>;

  constructor(firestore: Firestore) {
    const c = collection(firestore, 'stocks') as CollectionReference<StockInfo>;
    this.stocks = collectionData(c);
  }

  formatPrice(price: number): string {
    return Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(price / 100);
  }
}
