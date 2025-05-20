import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomComponent } from './room/room.component';
import { AppComponent } from './app.component';
import { EmployeeComponent } from './employee/employee.component';
import { CreateRoomComponent } from './room/create-room/create-room.component';
import { AuthGuard } from './keycloak-angular-module/AuthGuard';
import { HomeComponent } from './home/home/home.component';

export const routes: Routes = [
  {path:"",redirectTo:"room",pathMatch:"full"},
  {path:"",component:HomeComponent,canActivate: [AuthGuard]},
   {path:"dashboard",component:AppComponent},
   {path:"room",component:RoomComponent},
   {path:"addRoom",component:CreateRoomComponent},
   {path:"employee",component:EmployeeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
