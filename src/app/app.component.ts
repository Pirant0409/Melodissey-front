import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { IdbService } from './services/idb.service';
import { TMDBService } from './services/tmdb.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  constructor(private tmdbService: TMDBService) {
  }
  title = 'melodissey-front';
  lastID = 0;
  ngOnInit(): void {
    this.tmdbService.getAllids().subscribe((ids) => {
      this.lastID = ids[ids.length - 1];
    });
  }

  changeActiveTab(isGOD:boolean){
    const previousElement = document.getElementById("previous");
    const dayElement = document.getElementById("GOD");
    const url = window.location.pathname;
    if (previousElement && dayElement) {
      previousElement.classList.remove("active");
      dayElement.classList.remove("active")
      if (isGOD){
        dayElement.classList.add("active");
      }
      //check if day in the url
      else if(!url.includes("day")){
        previousElement.classList.add("active")
      }
    }
  }
}
