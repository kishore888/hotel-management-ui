import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { CreateRoomComponent } from './room/create-room/create-room.component';
import { AuthGuard } from './keycloak-angular-module/AuthGuard';
import { HomeComponent } from './home/home.component';
import { RoomTypeComponent } from './room/room-type/room-type.component';
import { AddRoomComponent } from './room/add-room/add-room.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MainLayoutComponent } from './hotel/main-layout.component/main-layout.component';
import { CreateHotelComponent } from './hotel/create-hotel/create-hotel.component';
import { RoleGuard } from './keycloak-angular-module/RoleGuard';
import { FormConfigComponent } from './form-config/form-config.component';
import { DashboardComponent } from './hotel/dashboard/dashboard.component';
import { PaymentAccount } from './payment/payment-account/payment-account';
import { HotelPaymentGatewayComponent } from './payment/hotel-payment-gateway/hotel-payment-gateway.component';
import { PaymentGatewayComponent } from './payment/payment-gateway/payment-gateway.component';
import { HotelPlanComponent } from './hotel/hotel-plan/hotel-plan.component';

export const routes: Routes = [
  // {path:"",redirectTo:"home",pathMatch:"full"},//working scenario
  // {path:"home",component:HomeComponent},//for home, about,price,modules etc
  // {path:"",component:UserProfileComponent,canActivate: [AuthGuard]},//working
  //  {path:"dashboard",component:AppComponent},
  //  {path:"addRoomType",component:RoomTypeComponent},
  //  {path:"room",component:RoomComponent},
  // //  {path:"addRoom",component:CreateRoomComponent},
  //  { path: 'addRoom', loadComponent: () => import('./room/add-room/add-room.component').then((c) => c.AddRoomComponent)},
  //  {path:"employee",component:EmployeeComponent}

  { path: '', redirectTo:"home",pathMatch:"full"},
  { path: 'home', component: HomeComponent },             // public landing page
  { path: 'register-hotel', component: CreateHotelComponent, canActivate: [RoleGuard] }, // SUPER_ADMIN only
  {
    path: '',
    component: MainLayoutComponent, // layout wrapper for authenticated pages
    canActivateChild: [AuthGuard],   // <-- protect all child routes
    children: [
      { path: 'room', component: RoomComponent },
      { path: 'addRoom', loadComponent: () => import('./room/add-room/add-room.component').then((c) => c.AddRoomComponent)},
      { path: 'userprofile', loadComponent: () => import('./user-profile/user-profile.component').then((c) => c.UserProfileComponent)},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'addRoomType', component:RoomTypeComponent},
      { path: 'employee', component: EmployeeComponent },
      { path: 'form-config', component: FormConfigComponent },
      { path: 'paymentAccount/create', component: PaymentAccount },
      { path: 'hotelPaymentGateway/create', component: HotelPaymentGatewayComponent },
      { path: 'paymentGateway/create', component: PaymentGatewayComponent },
      { path: 'hotelPlan/create', component: HotelPlanComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
