import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
// import { MatTreetModule } from '@angular/material/tree;
import { RoomComponent } from './room/room.component';
import { EmployeeComponent } from './employee/employee.component';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { RoomService } from './room/room.service';
import { ModalBootstrapComponent } from './modal/modal-bootstrap/modal-bootstrap.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateRoomComponent } from './room/create-room/create-room.component';
import { RoomTypeComponent } from './room/room-type/room-type.component';
import { RoomTypeService } from './room/room-type/room-type.service';
import { FormsModule } from '@angular/forms';
import { initializeKeycloak } from './environments/keycloak-init.factory';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { appConfig } from './app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './keycloak-angular-module/auth.interceptor';
import { MatMenuModule } from '@angular/material/menu';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlanMasterComponent } from './hotel/plan-master/plan-master.component';
import { StoreModule } from '@ngrx/store';
import { dataReducer } from './initialize-app/reducer';
import { EffectsModule } from '@ngrx/effects';
import { DataEffects } from './initialize-app/data-effects';

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    EmployeeComponent,
    ModalBootstrapComponent,
    CreateRoomComponent,
    RoomTypeComponent,
    HomeComponent,
    TopMenuComponent,
    PlanMasterComponent
  ],
  imports: [
    BrowserModule,
    KeycloakAngularModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    // MatTreeModule,
    BrowserModule,
    HttpClientModule,
    DataTablesModule,
    NgbModule,
    FormsModule,
    StoreModule.forRoot({ data: dataReducer }),  //initialize app when starts
    EffectsModule.forRoot([DataEffects])        //initialize app when starts
  ],
  providers: [
    // provideAnimationsAsync(), 
    RoomService, RoomTypeService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      // useClass: TokenInterceptor,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor, //cfg to send the Keycloak Token for every http request
      multi: true
    },
    //below for keycloak setup but not using it
    // {provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true,
    // }
    // appConfig.providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
