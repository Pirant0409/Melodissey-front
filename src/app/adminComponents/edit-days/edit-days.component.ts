import { Component, OnInit} from '@angular/core';
import { TMDBService } from '../../services/tmdb.service';
import { ActivatedRoute } from '@angular/router';
import { DayInterface } from '../../interfaces/day-interface';
import { RawMoviesInterface } from '../../interfaces/raw-movies-interface';
import { identity } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-days',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-days.component.html',
  styleUrl: './edit-days.component.scss'
})
export class EditDaysComponent implements OnInit {
  constructor(private tmdbService:TMDBService, private route:ActivatedRoute) {}

  dayID: number = 0;
  dayInfo: DayInterface | null = null;
  movieInfo: RawMoviesInterface | null = null;

  editData: FormGroup = new FormGroup({
    id: new FormControl(''),
    tmdbid: new FormControl(''),
    ytbid: new FormControl(''),
    media: new FormControl(''),
    available_date: new FormControl(''),

    title: new FormControl(''),
    release_date: new FormControl(''),
    overview: new FormControl(''),
    collection: new FormControl(''),
    poster_path: new FormControl(''),
    actor1: new FormControl(''),
    actor2: new FormControl(''),
    actor3: new FormControl(''),
    director: new FormControl(''),
  });

  
  ngOnInit(): void {
    this.getParams();
  }

  onSubmit(): void {
  }
  
  private getParams(): void {
    this.route.queryParamMap.subscribe((params:any) => {
      this.dayID = params["params"]["id"];
      console.log(this.dayID);
      this.getDayInfo(this.dayID);
      this.getMovieInfo(this.dayID);
    });
  }
  
  private getDayInfo(id: number): void {
    this.tmdbService.getAllDays().subscribe((days) => {
      this.dayInfo = days[id];
      this.populateForm('day');
    });
  }
  
  private getMovieInfo(id:number): void {
    this.tmdbService.getAllMovies().subscribe((movies) => {
      this.movieInfo = movies[id];
      console.log(this.movieInfo);
      this.populateForm('movie');
    });
  }
  
  private populateForm(data:string): void {
    if (data === 'day' && this.dayInfo) {
      this.editData.patchValue({
        id: this.dayInfo.id,
        ytbid: this.dayInfo.ytbid,
        tmdbID: this.dayInfo.tmdbID,
        media: this.dayInfo.media,
        available_date: this.dayInfo.available_date,
      });
    }
    if (data === 'movie' && this.movieInfo) {
      this.editData.patchValue({
        title: this.movieInfo.original_title,
        release_date: this.movieInfo.release_date,
        overview: this.movieInfo.overview,
        collection: this.movieInfo.collection,
        poster_path: this.movieInfo.poster_path,
        actor1: this.movieInfo.actor1,
        actor2: this.movieInfo.actor2,
        actor3: this.movieInfo.actor3,
        director: this.movieInfo.director,
      });
    }
  }
  
}
