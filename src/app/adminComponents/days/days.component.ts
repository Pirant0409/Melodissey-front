import { Component } from '@angular/core';
import { TMDBService } from '../../services/tmdb.service';
import { DaysInterface } from '../../interfaces/days-interface';
import { RawMoviesInterface } from '../../interfaces/raw-movies-interface';

@Component({
    selector: 'app-days',
    imports: [],
    templateUrl: './days.component.html',
    styleUrl: './days.component.scss'
})
export class DaysComponent {

  allDays: DaysInterface[] = [];
  allMovies: RawMoviesInterface[] = [];
  constructor(private tmdbService:TMDBService) { }

  ngOnInit(): void {
    this.getAllDays();
    this.getAllMovies();
  }

  private getAllDays(): void {
    this.tmdbService.getAllDays().subscribe((days) => {
      this.allDays = days;
    });
  }

  private getAllMovies(): void {
    this.tmdbService.getAllMovies().subscribe((movies) => {
      this.allMovies = movies;
    });
  }
}
