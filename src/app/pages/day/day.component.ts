import { Component, HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common'
import {FormsModule} from '@angular/forms';
import {GuessHistoryInterface} from '../../interfaces/guess-history-interface';
import { TMDBService } from '../../services/tmdb.service';
import { MovieInterface } from '../../interfaces/movie-interface';
import { AppComponent } from '../../app.component';
import { IdbService } from '../../services/idb.service';
import { StatsInterface } from '../../interfaces/stats-interface';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule,],
    templateUrl: './day.component.html',
    styleUrl: './day.component.scss'
})
export class DayComponent implements OnInit{
  
  private player:any;
  private searchTimeout: any=null;
  private done:boolean = false;
  private maxTime:number = 3;
  private timer: any;
  private ytbID: string = "";
  private progress : any;
  
  //###### display variables ######
  progressRestored: boolean = false;
  dataLoaded: boolean = false;
  YTPReady: boolean = false;
  showResult: boolean = false;
  showGuessInfo: boolean = false;
  dropdownVisible: boolean = false;
  isPlaying:boolean = false;
  statsLoaded:boolean = false;

  //###### data variables ######
  roomType="day";
  isGOD: boolean = false;
  allDays: number[]=[];
  dayID: number = 0;
  allRooms: string[]=[];
  roomID: string = "";
  movies:MovieInterface[] = []
  currentGuess: string = "";
  guessHistory: GuessHistoryInterface[]=[];
  stats: StatsInterface = {dayID:0,total:0,first_guess:0,second_guess:0,third_guess:0,fourth_guess:0,fifth_guess:0,lost:0}
  ids = ["guess-id-1","guess-id-2","guess-id-3","guess-id-4","guess-id-5"]

  answer:GuessHistoryInterface = {original_title:"",tmdbID:0,isSameCollection:false,isRight:false,poster_path:"",release_date:"",media:"",hint:""}
  
  constructor(private tmdbService: TMDBService, private idbService: IdbService, private appComponent:AppComponent) {
  }
  
  ngOnInit(): void {
    console.log("init")
    if (window.location.href.includes("day")){
      this.roomType = "day";
      this.getDayID();
    }
    else if (window.location.href.includes("room")){
      console.log("room detected")
      this.roomType = "room";
      this.getRoomID();
    }
    else{
      window.location.href = ""
    }
    this.setupMaxTime(this.guessHistory.length);
  }



  //########################################    SEARCH FIELD    ########################################
   

  onSearch(){
    if(this.searchTimeout != null){
      clearTimeout(this.searchTimeout)
    }
    
    this.searchTimeout=setTimeout(()=>{
      this.movies = [];
      if(this.currentGuess.length>2){
        this.tmdbService.searchMovies(this.currentGuess).subscribe({
          next: (response) => {
            this.movies = response;
          },
          error: (error) => {
            console.log(error)
          }
        })
      }}, 500)
    }
    
    
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Vérifier si l'élément cliqué est à l'extérieur du champ de texte et de la liste déroulante
    const clickedInsideInputField = event.target instanceof HTMLElement && event.target.closest('.form-control');
    const clickedInsideDropdown = event.target instanceof HTMLElement && event.target.closest('.dropdown-menu');
    if (!clickedInsideInputField && !clickedInsideDropdown) {
      this.movies = [];
    }
  }



  //########################################    GAME INIT    ########################################


  private async loadProgress(){
    this.progress = await this.idbService.getProgress(this.dayID);
    console.log(this.dayID)
    console.log(this.progress)
    if (this.progress !== undefined){
      const savedProgression = this.progress["progress"];
      const savedAnswer = this.progress["answer"];
      this.progressRestored = true;
      this.restoreProgress(savedProgression,savedAnswer)
      
    }
  }

  private restoreProgress(savedProgression:GuessHistoryInterface[],answer:GuessHistoryInterface){
    if (answer.original_title != ""){
      this.answer = answer;
    }
    savedProgression.forEach((guess,index) => {
      this.updateGuessHistory(guess,index,true)
    })
  }
  

  private getDayID(){
    //store current url location in const
    //get the last number from the url
    //set this.currentDay to the number
    
    const url = window.location.href;
    const urlParams = url.split('/day/');
    const urlID = urlParams[1].split ('?');
    this.dayID = parseInt(urlID[0]);
    this.tmdbService.getAllids().subscribe({
      next: (response) => {
        this.allDays=response;
        const idOfTheDay = this.allDays[this.allDays.length-1]
        if (idOfTheDay == this.dayID){
          this.isGOD = true;
        }
        if (!this.allDays.includes(this.dayID)){
          window.location.href = ""
        }
        else{
          this.getGameData(this.dayID)
        }
        this.appComponent.changeActiveTab(this.isGOD);
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  private getRoomID(){
    //store current url location in const
    //get the last number from the url
    //set this.currentDay to the number
    console.log("getRoomID")
    const url = window.location.href;
    const urlParams = url.split('/room/');
    const urlID = urlParams[1].split ('?');
    this.roomID = urlID[0];
    this.tmdbService.getAllRoomids().subscribe({
      next: (response) => {
        this.allRooms=response;
        if (!this.allRooms.includes(this.roomID)){
          console.log("room not found")
          window.location.href = ""
        }
        else{
          console.log("room found")
          this.getRoomData(this.roomID)
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  private getGameData(dayID:number){
    this.dataLoaded = true;
    this.tmdbService.getYTBid(dayID).subscribe({
      next: (response) => {
        this.ytbID = response.ytbID;
        this.loadYTBPlayer();
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  private getRoomData(roomID:string){
    this.dataLoaded = true;
    this.tmdbService.getRoomYTBid(roomID).subscribe({
      next: (response) => {
        this.ytbID = response.ytbID;
        this.loadYTBPlayer();
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  goToNextDay(){
    //navigate to next url
    if(this.allDays.includes(this.dayID+1)){
      let nextDay = this.dayID+1;
      window.location.href = "/day/"+nextDay;
    }
  }

  goToPreviousDay(){
    //navigate to previous url
    if(this.allDays.includes(this.dayID-1)){
      let previousDay = this.dayID-1;
      window.location.href = "/day/"+previousDay;
    }
  }

    //########################################    ANSWER PROCESS    ########################################


    onSubmit(guess:MovieInterface){
      this.currentGuess = "";
      this.movies = [];
      this.processGuess(guess)
    }
    
    private processGuess(guess: MovieInterface){
      const historyLength = this.guessHistory.length;

      let fullGuess:GuessHistoryInterface = {original_title:guess.original_title,
                                             tmdbID:guess.tmdbID,
                                             isSameCollection:false,
                                             isRight:false,
                                             poster_path:guess.poster_path,
                                             release_date:guess.release_date,
                                             media:guess.media,hint:""}
      this.tmdbService.sendGuess(this.dayID,guess,historyLength).subscribe({
        next: (response) => {
          if(response.isRight){
            fullGuess.isRight = response.isRight
            fullGuess.original_title = response.original_title
            fullGuess.release_date = response.release_date
            fullGuess.poster_path = response.poster_path
            fullGuess.media = response.media
          }
          else{
            fullGuess.hint = response.hint
          }
          if(response.collection){
            fullGuess.isSameCollection = true
          }
          if(historyLength == 4 ){
            this.answer.isRight = response.isRight
            this.answer.original_title = response.original_title
            this.answer.release_date = response.release_date
            this.answer.poster_path = response.poster_path
            this.answer.media = response.media
          }
          this.updateGuessHistory(fullGuess,historyLength)
        },
        error: (error) => {
          console.log(error)
        }
      })
      
    }
    
    private updateGuessHistory(guess:GuessHistoryInterface, historyLength:number, isRestored:boolean = false){
      const guessSquare = document.getElementById(this.ids[historyLength]) as HTMLDivElement;
      this.guessHistory.push(guess);
      if(guess.isRight){
        guessSquare.style.color = "#2DBA61";
        this.answer = guess;
      }
      else if(guess.isSameCollection){
        guessSquare.style.color = "rgb(207, 171, 7)";
      }
      else{
        guessSquare.style.color = "#BB2D3B";
      }
      if(historyLength == 4 || guess.isRight){
        this.endGame();
      }
      if(!isRestored){
        this.saveDataInDB();
      }
      this.setupMaxTime(historyLength+1)
    }
    
    private endGame(){
      this.showResult = true
      const updatedPlayer = document.getElementById("player") as HTMLIFrameElement;
      updatedPlayer.height = "fit-content";
      updatedPlayer.width = "fit-content";
      //center the player
      updatedPlayer.style.margin = "auto";
      updatedPlayer.style.display = "block";
      console.log(this.player.width)
      this.tmdbService.getStats(this.dayID).subscribe({
        next: (response) => {
          this.stats = response;
          console.log("Stats")
          console.log(this.stats)
          this.statsLoaded=true;
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
    
    private saveDataInDB(){
      this.idbService.saveProgress(this.dayID,this.guessHistory,this.answer);
    }
  

    
    //########################################    YOUTUBE PLAYER    ########################################

    
    private startTimer(): void {
      if (this.maxTime != 9999){
        let currentTime = this.player.getCurrentTime();
        // Vérifie la position de la vidéo toutes les 1000 ms (1 seconde)
        this.timer = setInterval(() => {
          console.log(currentTime)
          if (currentTime >= this.maxTime) {
            this.player.seekTo(0, true); // Reviens à 0
            this.onPlayButtonClicked()
          }
          currentTime += 0.5
        }, 500); // Vérification chaque seconde

      }
    }

    private stopTimer(): void {
      if (this.timer) {
        clearInterval(this.timer); // Nettoyer le timer existant
        this.timer = null; // Réinitialiser la variable pour éviter les erreurs
      }
    }
    
    private setupMaxTime(guessAmount: number){
      if (guessAmount == 0){
        this.maxTime = 3;
      }
      else if (guessAmount == 1){
        this.maxTime = 10;
      }
      else if (guessAmount == 2){
        this.maxTime = 25;
      }
      else if (guessAmount == 3){
        this.maxTime = 50;
      }
      else if (this.showResult || guessAmount == 4){
        console.log(this.showResult)
        this.maxTime = 9999
      }
    }
    onPlayButtonClicked(ended:boolean = false): void {
      if(ended){
        this.stopTimer();
      }
      else{
        if (this.isPlaying){
          this.player.pauseVideo();
          this.stopTimer();
        }
        else{
          this.player.playVideo();
          this.startTimer();
        }
      }
      this.isPlaying = !this.isPlaying;
    }
    
    backwardButton(seconds:number=3){
      this.player.seekTo(this.player.getCurrentTime()-seconds,true)
      
    }
    
    forwardButton(seconds:number=3){
      if (this.player.getCurrentTime()+seconds > this.maxTime){
        this.player.seekTo(this.maxTime,true)
      }
      else{
        this.player.seekTo(this.player.getCurrentTime()+seconds,true)

      }
      
    }
    
    private loadYTBPlayer(){
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
        height: '0',
        width: '0',
        videoId: this.ytbID,
        events: {
          'onReady': (event) => {this.onPlayerReady(event)},
          'onStateChange': (event) => {this.onPlayerStateChange(event)}
        }
      });
    }
  
    private onPlayerReady(event:any){
      this.YTPReady = true;
      this.loadProgress();
      console.log("player Ready")
    }
  
    private onPlayerStateChange(event:any){
      if (event.data == YT.PlayerState.ENDED){
        this.onPlayButtonClicked(true);
      }
    }
    
  }
  
  