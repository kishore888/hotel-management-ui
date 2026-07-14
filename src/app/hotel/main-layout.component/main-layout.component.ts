import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, HostListener, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { HomeService } from '../../home/home.service';
import { loadHotel } from '../../initialize-app/actions';
import { selectHotel } from '../../initialize-app/selectors';
import { KeycloakService } from 'keycloak-angular';
import { Hotel } from '../../model/hotel.model';

@Component({
  selector: 'app-main-layout.component',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  title: string = 'hotel-management-ui';
  hotel$: Observable<Hotel | null>;
  @ViewChild(MatSidenav)
  sidenav: MatSidenav | undefined;
  isMobile: boolean = false;
  // isCollapsed = true;
  isLoggedIn: boolean = false;

  // false = collapsed (icons only). true = expanded (icons + labels)
  isExpanded: boolean = false;
  // isMobile = false;

  constructor(
    private observer: BreakpointObserver,
    private router: Router,
    private store: Store,
    private homeServiceService: HomeService,
    private keycloakService: KeycloakService,
    private cdr: ChangeDetectorRef
  ) {
    this.isLoggedIn = this.homeServiceService.isLoggedIn;
    this.hotel$ = this.store.select(selectHotel);
    this.updateIsMobile();
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

    const token = this.keycloakService.getKeycloakInstance().tokenParsed;
    // const hotelId = token?.['hotelId'] ?? '';
    // If group name has a prefix (e.g., groups: ["/Hotel_55LQ23392D299EGGVK"])
    const group: string = token?.['groups']?.[0] ?? '';
    const hotelId = group.replace(/^\/?(Hotel_\s*)/, '').trim();
    this.store.dispatch(loadHotel({ hotelId }));//dispatching calls to initialize app
    // this.store.dispatch(loadRooms());
    // this.homeServiceService.initAuth();
    
    this.cdr.markForCheck();
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
