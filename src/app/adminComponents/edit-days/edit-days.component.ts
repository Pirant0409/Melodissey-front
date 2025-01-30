import { Component, OnInit} from '@angular/core';
import { TMDBService } from '../../services/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DayInterface } from '../../interfaces/day-interface';
import { RawMoviesInterface } from '../../interfaces/raw-movies-interface';
import { Dialog } from 'primeng/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';

@Component({
  selector: 'app-edit-days',
  imports: [ReactiveFormsModule, Dialog, Message],
  templateUrl: './edit-days.component.html',
  styleUrl: './edit-days.component.scss'
})
export class EditDaysComponent implements OnInit {

  constructor(private tmdbService:TMDBService, private route:ActivatedRoute, private router:Router) {}

  dayID: number = 0;
  dayInfo: DayInterface | null = null;
  movieInfo: RawMoviesInterface | null = null;
  showMessage = false;
  visible: boolean = false;
  severity: string = "info";
  primeIcon = "pi pi-exclamation-triangle";
  differences: { [key: string]: any } = {};
  allBaseData: { [key: string]: any } = {};
  message: string = "Could not be updated";
  private dayUpdated: boolean = false;
  private movieUpdated: boolean = false;

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

  onSubmit(confirmed:boolean = false): void {
    const newDay: DayInterface = this.getDayFormInfo();
    const newMovie: RawMoviesInterface = this.getMovieFormInfo();
    
    if (confirmed) {
      this.confirmUpdate(newDay, newMovie);
    }
    else{
      this.checkDifference(newDay, newMovie);
    }
    
  }

  private confirmUpdate(newDay: DayInterface,newMovie : RawMoviesInterface): void {
    this.visible = false;
    this.message = "";
    this.tmdbService.updateDay(newDay).subscribe(response => {
      if (response.status == 200) {
        this.dayUpdated = true;
        if (this.movieUpdated) {
          this.router.navigate(['/admin/days/', this.dayID+1], { queryParams: { id: this.dayID, success: true } });
        }
      }
      else {
        this.message = response.detail;
        this.severity = "error";
        this.primeIcon = "pi pi-times-circle"
      }
    });
    this.tmdbService.updateMovie(newMovie).subscribe(response => {
      if (response.status == 200) {
        this.movieUpdated = true;
        if (this.dayUpdated) {
          this.router.navigate(['/admin/days/', this.dayID+1], { queryParams: { id: this.dayID, success: true }, });
        }
      }
      else {
        this.message = response.detail;
        this.severity = "error";
        this.primeIcon = "pi pi-times-circle"
      }

    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  private getDayFormInfo(): DayInterface {
    const newDay: DayInterface = {
      id: this.editData.value.id,
      ytbid: this.editData.value.ytbid,
      tmdbid: this.editData.value.tmdbid,
      media: this.editData.value.media === "Movie" ? "movie" : "tv",
      available_date: this.editData.value.available_date,
    };

    return newDay;
  }

  private getMovieFormInfo(): RawMoviesInterface {
    const newMovie: RawMoviesInterface = {
      original_title: this.editData.value.title,
      release_date: this.editData.value.release_date,
      overview: this.editData.value.overview,
      collection: this.editData.value.collection,
      poster_path: this.editData.value.poster_path,
      actor1: this.editData.value.actor1,
      actor2: this.editData.value.actor2,
      actor3: this.editData.value.actor3,
      director: this.editData.value.director,
      media: this.editData.value.media === "Movie" ? "movie" : "tv",
      tmdbid: this.editData.value.tmdbid
    };

    return newMovie;
  }

  private checkDifference(newDay: DayInterface, newMovie: RawMoviesInterface): void {
    this.allBaseData = { ...this.dayInfo, ...this.movieInfo };
    let allNewData = { ...newDay, ...newMovie };
    for (let key in this.allBaseData) {
      if (allNewData[key as keyof DayInterface] !== this.allBaseData![key as keyof DayInterface]) {
        this.differences[key] = allNewData[key as keyof DayInterface];
      }
    }

    if (Object.keys(this.differences).length > 0) {
      this.visible = true;
    }
  }
  
  private getParams(): void {
    this.route.queryParamMap.subscribe((params:any) => {
      if (params["params"]["id"]) {
        this.dayID = Number(params["params"]["id"]); // Convert to number
      }
      else {
        const currentURL = this.router.url;
        const urlParts = currentURL.split('/');
        this.dayID = Number(urlParts[urlParts.length - 1]) -1;
      }
      this.getDayInfo(this.dayID);
      this.getMovieInfo(this.dayID);
      if (params["params"]["success"]) {
        this.message = "Data updated successfully";
        this.severity = "success";
        this.showMessage = true;
        this.primeIcon = "pi pi-check-circle";
      }

      this.router.navigate([], {
        queryParams: {}
      });

      this.editData.reset();

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
      this.populateForm('movie');
    });
  }
  
  private populateForm(data:string): void {
    if (data === 'day' && this.dayInfo) {
      this.editData.patchValue({
        id: this.dayInfo.id,
        ytbid: this.dayInfo.ytbid,
        tmdbid: this.dayInfo.tmdbid,
        media: this.dayInfo.media === 'movie' ? 'Movie' : 'TV',
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

