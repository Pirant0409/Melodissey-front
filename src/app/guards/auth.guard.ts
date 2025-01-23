import { CanActivateFn, Router } from '@angular/router';
import { TMDBService } from '../services/tmdb.service';
import { inject } from '@angular/core';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  
  const tmdbService = inject(TMDBService);
  const router = inject(Router);
  return tmdbService.isAuthenticated().pipe(map((response: boolean) => {
    if (response) {
      console.log('User is authenticated');
      return true;
    }
    router.navigate(['/admin/login']);
    return false;
  }));
};
