import { Component, OnInit } from '@angular/core';
import { MovieInterface } from '../../interfaces/movie-interface';
import { TMDBService } from '../../services/tmdb.service';
import { IdbService } from '../../services/idb.service';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-previous',
    imports: [],
    templateUrl: './previous.component.html',
    styleUrl: './previous.component.scss'
})
export class PreviousComponent implements OnInit{

  allProgress:any;
  allDays: number[]= []
  stylesLoaded: boolean = false;

  constructor(private tmdbService: TMDBService, private idbService:IdbService, private appComponent:AppComponent){}
  ngOnInit(){
    this.getDayIDs();
    this.appComponent.changeActiveTab(false);
  }
  
  
  changeLocation(index:number){
    window.location.replace("http://localhost:4200/day/"+index)
  }
  
  private getDayIDs(){
    //store current url location in const
    //get the last number from the url
    //set this.currentDay to the number
    this.tmdbService.getAllids().subscribe({
      next: (response) => {
        this.allDays=response;
        console.log(this.allDays)
        this.loadProgress()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  private async loadProgress(){
    this.allProgress = await this.idbService.getAllProgress()
    console.log(this.allProgress)
    this.getSquareStyles()
  }

  private getSquareStyles(){
    for (let i = 0; i < this.allDays.length; i++) {
      let dayID = this.allDays[i]
      console.log(this.allProgress[dayID])
      if(this.allProgress[dayID] != undefined){
        if(this.allProgress[dayID]["progress"].length == 0){
          //a color code 100% transparent
          this.allProgress[dayID]["color"]= "\#ffffff"
        }
        else if(this.allProgress[dayID]["answer"].isRight){
          this.allProgress[dayID]["color"]= "\#2DBA61"
          this.allProgress[dayID]["fill"]= 100
        }
        else{
          for(let progress of this.allProgress[dayID]["progress"]){
            if (progress.isSameCollection){
              this.allProgress[dayID]["color"]= "\#CFAB07"
              break;
            }
            else{
              this.allProgress[dayID]["color"]= "\#BB2D3B"
            }
          }
        }
        if(this.allProgress[dayID]["fill"]!=100){
          this.allProgress[dayID]["fill"]=this.allProgress[dayID]["progress"].length / 5 *100
        }
      }
    }
    this.stylesLoaded = true;
    
  }
  
}
