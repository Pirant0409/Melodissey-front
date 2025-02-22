import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Dialog } from 'primeng/dialog';
import { TMDBService } from './services/tmdb.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [ReactiveFormsModule, RouterOutlet, Dialog,CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  dialogVisible = false;
  isNavbarOpen = false;
  formGroup: FormGroup = new FormGroup({
    roomID : new FormControl(''),
  });
  constructor(private tmdbService: TMDBService, private router:Router) {
  }
  title = 'melodissey-front';
  lastID = 0;
  ngOnInit(): void {
    this.tmdbService.getAllids().subscribe((ids) => {
      this.lastID = ids[ids.length - 1];
    });
    this.changeActiveTab(false);
  }


  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  changeActiveTab(isGOD:boolean){
    const previousElement = document.getElementById("previous");
    const dayElement = document.getElementById("GOD");
    const createElement = document.getElementById("create");
    const url = window.location.pathname;
    if (previousElement && dayElement && createElement){ 
      previousElement.classList.remove("active");
      dayElement.classList.remove("active")
      createElement.classList.remove("active");
      if (isGOD){
        dayElement.classList.add("active");
      }
      //check if day in the url
      else if(url.includes("create")){
        createElement.classList.add("active");
      }
      else {
        previousElement.classList.add("active")
      }
    }
  }

  toggleJoinRoom(){
    this.dialogVisible = true;
  }

  joinRoom(){
    if (this.formGroup.value.roomID != ""){
     // go to route X.com/roomID

      this.dialogVisible = false;
      this.router.navigate(['/room/', this.formGroup.value.roomID]);

    }

  }
}
