import { Component } from '@angular/core';
import { TMDBService } from '../../services/tmdb.service';
import { DayInterface } from '../../interfaces/day-interface';
import { RawMoviesInterface } from '../../interfaces/raw-movies-interface';
import { RouterLink } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-days',
    imports: [RouterLink],
    templateUrl: './days.component.html',
    styleUrl: './days.component.scss'
})
export class DaysComponent {

  allDays: DayInterface[] = [];
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
