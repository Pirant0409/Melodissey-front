import { Routes } from '@angular/router';
import { DayComponent } from './pages/day/day.component'
import { AboutComponent } from './pages/about/about.component'
import { PreviousComponent } from './pages/previous/previous.component';
import { LoginComponent } from './adminComponents/login/login.component';
import { authGuard } from './guards/auth.guard';
import { MoviesComponent } from './adminComponents/movies/movies.component';
import { DaysComponent } from './adminComponents/days/days.component';
import { EditDaysComponent } from './adminComponents/edit-days/edit-days.component';

export const routes: Routes = [
    {path: '', component: PreviousComponent},
    {path: 'about', component: AboutComponent},
    {path: 'day/:id', component: DayComponent},
    {path: 'admin/login', component: LoginComponent},
    {path: 'admin/days', component: DaysComponent, canActivate: [authGuard]},
    {path: 'admin/movies', component: MoviesComponent, canActivate: [authGuard]},
    {path: 'admin/days/:id', component: EditDaysComponent, canActivate: [authGuard]},
    {path: 'admin', redirectTo: 'admin/login'},
    {path: 'admin/:anything', redirectTo: 'admin/login'},
    {path: '**', redirectTo: ''}
];
