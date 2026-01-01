import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HomeService } from '../../home/home.service';
import { loadHotel } from '../../initialize-app/actions';

@Component({
  selector: 'app-main-layout.component',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
  title = 'hotel-management-ui';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= true;
  isCollapsed = true;
  isLoggedIn: boolean = false;

  constructor(private observer: BreakpointObserver, private router: Router, private store: Store, private homeServiceService: HomeService) {
    this.isLoggedIn = this.homeServiceService.isLoggedIn;
  }

  // keycloak = new Keycloak({ 
  //   url: environment.keycloak.url,
  //   realm: environment.keycloak.realm,
  //   clientId: environment.keycloak.clientId
  // });

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });

    this.store.dispatch(loadHotel());//dispatching calls to initialize app
    // this.store.dispatch(loadRooms());
    // this.homeServiceService.initAuth();
  }

  toggleMenu() {
    if(this.isMobile){
      this.sidenav.toggle();
      this.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      // this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.sidenav.toggle(); // can be collapsed for both mobile and desktop
      this.isCollapsed = !this.isCollapsed;
    }
  }

}
