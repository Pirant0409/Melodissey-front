import { Routes } from '@angular/router';
import { DayComponent } from './pages/day/day.component'
import { AboutComponent } from './pages/about/about.component'
import { PreviousComponent } from './pages/previous/previous.component';
import { LoginComponent } from './adminComponents/login/login.component';
import { authGuard } from './guards/auth.guard';
import { DaysComponent } from './adminComponents/days/days.component';
import { EditDaysComponent } from './adminComponents/edit-days/edit-days.component';
import { CreateRoomComponent } from './pages/create-room/create-room.component';
import { RestoreComponent } from './adminComponents/restore/restore.component';

export const routes: Routes = [
    {path: '', component: PreviousComponent},
    {path: '?page=:id', component: PreviousComponent},
    {path: 'about', component: AboutComponent},
    {path: 'day/:id', component: DayComponent},
    {path: 'createRoom', component: CreateRoomComponent},
    {path: 'room/:id', component: DayComponent},

    {path: 'admin/login', component: LoginComponent},
    {path: 'admin/days', component: DaysComponent, canActivate: [authGuard]},
    {path: 'admin/days/:id', component: EditDaysComponent, canActivate: [authGuard]},
    {path: 'admin/restore', component: RestoreComponent, canActivate: [authGuard]},
    {path: 'admin', redirectTo: 'admin/login'},
    {path: 'admin/:anything', redirectTo: 'admin/login'},
    {path: '**', redirectTo: ''}
];
