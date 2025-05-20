import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hotel-management-ui';
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isMobile= true;
  isCollapsed = true;

  constructor(private observer: BreakpointObserver, private router: Router) {}

  ngOnInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((screenSize) => {
      if(screenSize.matches){
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    });
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

  navigateToProfile() {
    this.router.navigate(['/profile']); // Redirect to Profile Page
  }

  logout() {
    localStorage.removeItem('token'); // Clear authentication token
    this.router.navigate(['/login']); // Redirect to login page
  }

}
