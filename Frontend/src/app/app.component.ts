import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { loadUmfragen } from './umfrage-config/umfrage.actions';
import { loadUnternehmen } from './unternehmen-config/unernehmen.actions';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isMenuClicked = false;
  // me
  constructor(private store: Store<AppState>,private router: Router) {}

  navigateToSehen() {
    this.router.navigate(['unternehmenList', false]);  
    this.toggleMenu();
  }
  navigateToVergleichen() {
    this.router.navigate(['unternehmenList', true]);  
    this.toggleMenu();
  }

  ngOnInit(): void {
    this.store.dispatch(loadUmfragen());
    this.store.dispatch(loadUnternehmen());
  }

  isMenuVisible = false;

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }
}



