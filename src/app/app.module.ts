import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, DoughnutController, LineController, BarController, Legend, Tooltip } from 'chart.js';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeKeycloak } from './environments/keycloak-init.factory';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { appConfig } from './app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './keycloak-angular-module/auth.interceptor';
import { MatMenuModule } from '@angular/material/menu';
// import { TopMenuComponent } from './top-menu/top-menu.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlanMasterComponent } from './hotel/plan-master/plan-master.component';
import { StoreModule } from '@ngrx/store';
import { dataReducer } from './initialize-app/reducer';
import { EffectsModule } from '@ngrx/effects';
import { DataEffects } from './initialize-app/data-effects';
import { ChatbotModule } from './modal/chatbot/chatbot.module';
import { MatCardModule } from '@angular/material/card';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { CarouselModule } from 'primeng/carousel';
import { PaymentAccount } from './payment/payment-account/payment-account';
import { HotelPaymentGatewayComponent } from './payment/hotel-payment-gateway/hotel-payment-gateway.component';
import { PaymentGatewayComponent } from './payment/payment-gateway/payment-gateway.component';
import { EmployeeService } from './employee/employee.service';
import { EmployeeShiftScheduleService } from './employee/employee-shift-schedule.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MainLayoutComponent } from './hotel/main-layout.component/main-layout.component';
import { CreateHotelComponent } from './hotel/create-hotel/create-hotel.component';
import { DashboardComponent } from './hotel/dashboard/dashboard.component';
import { HotelPlanComponent } from './hotel/hotel-plan/hotel-plan.component';
import { ReservationComponent } from './room/reservation/reservation.component';
import { EmployeeFormComponent } from './employee/employee-form/employee-form.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeShiftScheduleComponent } from './employee/employee-shift-schedule/employee-shift-schedule.component';
import { FormConfigComponent } from './form-config/form-config.component';
import { DynamicFieldComponent } from './employee/dynamic-field/dynamic-field.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BaseChartDirective } from 'ng2-charts';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, DoughnutController, LineController, BarController, Legend, Tooltip);

@NgModule({
  declarations: [
    AppComponent,
    RoomComponent,
    EmployeeComponent,
    ModalBootstrapComponent,
    // CreateRoomComponent,
    // RoomTypeComponent,
    HomeComponent,
    // TopMenuComponent,
    PlanMasterComponent,
    PaymentAccount,
    HotelPaymentGatewayComponent,
    PaymentGatewayComponent,
    MainLayoutComponent,
    CreateHotelComponent,
    DashboardComponent,
    HotelPlanComponent,
    ReservationComponent,
    EmployeeFormComponent,
    EmployeeListComponent,
    EmployeeShiftScheduleComponent,
    FormConfigComponent,
    DynamicFieldComponent,
    // UserProfileComponent
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
    ChatbotModule,
    MatCardModule,
    TopMenuComponent,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    BaseChartDirective,
    StoreModule.forRoot({ data: dataReducer }),  //initialize app when starts
    EffectsModule.forRoot([DataEffects])        //initialize app when starts
  ],
  providers: [
    // provideAnimationsAsync(), 
    RoomService, RoomTypeService, EmployeeService, EmployeeShiftScheduleService,
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
