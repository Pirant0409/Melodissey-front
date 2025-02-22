import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { Message } from 'primeng/message';
import { MovieInterface } from '../../interfaces/movie-interface';
import { TMDBService } from '../../services/tmdb.service';

@Component({
  selector: 'app-create-room',
  imports: [ReactiveFormsModule, CommonModule, Message],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss'
})
export class CreateRoomComponent implements OnInit{

  private player:any;
  private dataToSend:any;

  selectedMovie:any;
  severity:string = "info";
  primeIcon:string = "";
  message:string = "";
  YTPReady:boolean = false;
  searchTimeout: any = null;
  showMessage:boolean = false;
  showYTBIDMessage:boolean = false;
  movies:MovieInterface[] = [];
  roomID:string | null = null;

  roomData: FormGroup = new FormGroup({  
    ytbid: new FormControl('',Validators.required),
    original_title: new FormControl('',Validators.required),
    hint1: new FormControl('',Validators.required),
    hint2: new FormControl('',Validators.required),
    hint3: new FormControl('',Validators.required),
    hint4: new FormControl('',Validators.required)
  });
  //roomid,tmdbid,media,collection,poster_path,release_date,

  constructor(private tmdbService:TMDBService) {}

  ngOnInit(): void {
      
  }

  onSubmit(): void {
    console.log(this.roomData.valid)
    if(this.roomData.valid && this.selectedMovie){
      this.dataToSend = {
        ytbid: this.roomData.value.ytbid,
        original_title: this.roomData.value.original_title,
        hint1: this.roomData.value.hint1,
        hint2: this.roomData.value.hint2,
        hint3: this.roomData.value.hint3,
        hint4: this.roomData.value.hint4,
        tmdbid: this.selectedMovie.tmdbID,
        media: this.selectedMovie.media,
        poster_path: this.selectedMovie.poster_path,
        release_date: this.selectedMovie.release_date,
        collection: this.selectedMovie.collection
      }
      this.tmdbService.createRoom(this.dataToSend).subscribe(response => {
        if (response.status == 200) {
          this.roomID = response.roomID;
          this.message = "Room created successfully";
          this.severity = "success";
          this.primeIcon = "pi pi-check";
          this.showMessage = true;
        }
        else {
          this.message = response.detail;
          this.severity = "error";
          this.primeIcon = "pi pi-times-circle";
          this.showMessage = true
        }
    });

    }
  }

  getYTBIframe(): void {
    if(this.roomData.value.ytbid.length > 5){
      if (this.searchTimeout != null) {
        clearTimeout(this.searchTimeout);
      }
      this.searchTimeout=setTimeout(()=>{
        this.loadYTBPlayer();
      },1000)

    }
  }

  getMovie(){
    if(this.searchTimeout != null){
      clearTimeout(this.searchTimeout)
    }
    
    this.searchTimeout=setTimeout(()=>{
      this.movies = [];
      if(this.roomData.value.original_title.length>2){
        this.tmdbService.searchMovies(this.roomData.value.original_title).subscribe({
          next: (response) => {
            this.movies = response;
          },
          error: (error) => {
            console.log(error)
          }
        })
      }}, 250)
    }

  onMovieClick(guess:MovieInterface){
    this.roomData.patchValue({
      ytbid: this.roomData.value.ytbid,
      original_title: guess.original_title,
      hint1: guess.media,
      hint2: "Staring " + guess.mainCast.join(", "),
      hint3: "Directed by " + guess.director,
      hint4: guess.overview

    });
    this.selectedMovie = guess;
    this.movies = [];
  }

  goToRoom(){
    if(this.roomID != null){
      window.location.href = "/room/" + this.roomID;
    }
  }

  copyLink(){
    if(this.roomID != null){
      navigator.clipboard.writeText("https://localhost:4200/room/" + this.roomID);
      this.message = "Link copied to clipboard";
      this.severity = "success";
      this.primeIcon = "pi pi-check";
      this.showMessage = true;
    }
  }
  private loadYTBPlayer(){
    if(this.YTPReady){
      this.player.destroy();
      this.YTPReady = false;
    }
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    if(firstScriptTag.parentNode != null){
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      this.onYoutubeIframeAPIReady();
    }
  }

  private onYoutubeIframeAPIReady(){
    this.player = new YT.Player('player', {
      height: '250',
      width: '70%',
      videoId: this.roomData.value.ytbid,
      events: {
        'onReady': (event) => {this.onPlayerReady(event)},
        'onStateChange': (event) => {this.onPlayerStateChange(event)},
      }
    });
  }

  private onPlayerReady(event:any){
    if(event.target.getDuration() <= 0){
      this.player.destroy();
      this.YTPReady = false;
      this.showYTBIDMessage = true;
    }
    else{
      this.showYTBIDMessage = false;
      this.YTPReady = true;
    }
  }

  private onPlayerStateChange(event:any){
    if (event.data == YT.PlayerState.ENDED){
      console.log("video ended")
    }
  }

}
