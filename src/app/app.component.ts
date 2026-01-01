import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadHotel, loadRooms } from './initialize-app/actions';
import { ChatbotComponent } from './modal/chatbot/chatbot.component';
import Keycloak from 'keycloak-js';
import { environment } from './environments/environment';
import { HomeService } from './home/home.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false
})
export class AppComponent {
  
  
}
