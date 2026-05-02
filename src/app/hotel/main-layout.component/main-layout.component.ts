import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { HomeService } from '../../home/home.service';
import { loadHotel } from '../../initialize-app/actions';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-main-layout.component',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  title = 'hotel-management-ui';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= false;
  // isCollapsed = true;
  isLoggedIn: boolean = false;

  // false = collapsed (icons only). true = expanded (icons + labels)
  isExpanded = false;
  // isMobile = false;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private store: Store,
    private homeServiceService: HomeService,
    private keycloakService: KeycloakService
  ) {
    this.isLoggedIn = this.homeServiceService.isLoggedIn;
  }

  // keycloak = new Keycloak({ 
  //   url: environment.keycloak.url,
  //   realm: environment.keycloak.realm,
  //   clientId: environment.keycloak.clientId
  // });

  ngOnInit() {
    // this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
    //   if(screenSize.matches){
    //     this.isMobile = true;
    //   } else {
    //     this.isMobile = false;
    //   }
    // });

    this.updateIsMobile();

    const token = this.keycloakService.getKeycloakInstance().tokenParsed;
    // const hotelId = token?.['hotelId'] ?? '';
    // If group name has a prefix (e.g., groups: ["/Hotel_55LQ23392D299EGGVK"])
    const group: string = token?.['groups']?.[0] ?? '';
    const hotelId = group.replace(/^\/?(Hotel_\s*)/, '').trim();
    this.store.dispatch(loadHotel({ hotelId }));//dispatching calls to initialize app
    // this.store.dispatch(loadRooms());
    // this.homeServiceService.initAuth();
  }

  // toggleMenu() {
  //   if(this.isMobile){
  //     this.sidenav.toggle();
  //     this.isCollapsed = false; // On mobile, the menu can never be collapsed
  //   } else {
  //     // this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
  //     this.sidenav.toggle(); // can be collapsed for both mobile and desktop
  //     this.isCollapsed = !this.isCollapsed;
  //   }
  // }

  toggleMenu(): void {
    if (this.isMobile && this.sidenav) {
      this.sidenav.toggle();
    } else {
      // this.sidenav.toggle();
      this.isExpanded = !this.isExpanded;
    }
  }

  @HostListener('window:resize')
  updateIsMobile(): void {
    this.isMobile = window.innerWidth < 768;
    // on mobile keep sidenav closed by default
    if (this.isMobile && this.sidenav) {
      this.sidenav.close();
    } else if (!this.isMobile && this.sidenav) {
      // ensure sidenav is visible on desktop
      this.sidenav.open();
    }
  }

}
