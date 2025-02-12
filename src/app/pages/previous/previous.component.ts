import { Component, OnInit } from '@angular/core';
import { MovieInterface } from '../../interfaces/movie-interface';
import { TMDBService } from '../../services/tmdb.service';
import { IdbService } from '../../services/idb.service';
import { AppComponent } from '../../app.component';

@Component({
    selector: 'app-previous',
    standalone: true,
    imports: [],
    templateUrl: './previous.component.html',
    styleUrl: './previous.component.scss'
})
export class PreviousComponent implements OnInit{

  allProgress:any;
  stylesLoaded: boolean = false;
  currentPage: number = 1;
  dividedDays: number[][] = []
  allDays: number[]= []

  constructor(private tmdbService: TMDBService, private idbService:IdbService, private appComponent:AppComponent){}
  ngOnInit(){
    this.getDayIDs();
    this.appComponent.changeActiveTab(false);
  }

  previousPage(){
    if(this.currentPage > 1){
      this.currentPage--;
      window.location.href = "?page="+this.currentPage
    }
  }

  changePage(page:number){
    if(page != this.currentPage && page > 0 && page <= this.dividedDays.length){
      this.currentPage = page;
    }
  }

  nextPage(){
    if(this.currentPage < this.dividedDays.length){
      this.currentPage++;
    }
  }
  
  private getDayIDs(){
    //store current url location in const
    //get the last number from the url
    //set this.currentDay to the number
    this.tmdbService.getAllids().subscribe({
      next: (response) => {
        this.allDays = response.reverse();
        if (this.allDays.length > 8){
          this.divideDays()
        }
        this.loadProgress()
      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  
  private divideDays(){
    let temp:number[]=[]
    for (let i = 0; i <= this.allDays.length; i++) {
      if(i%8 == 0 && i != 0 || i == this.allDays.length){
        this.dividedDays.push(temp)
        temp = []
      }
      temp.push(this.allDays[i])
    }
    this.getCurrentPage();
    
  }
  
  private getCurrentPage(){
    let url = window.location.href
    let page = url.split("?page=")[1]
    if(page != undefined){
      this.currentPage = parseInt(page)
    }
    if(this.currentPage == undefined || this.currentPage < 1 || this.currentPage > this.dividedDays.length){
      this.currentPage = 1
    }
  }
  private async loadProgress(){
    this.allProgress = await this.idbService.getAllProgress()
    this.getSquareStyles()
  }

  private getSquareStyles(){
    for (let i = 0; i < this.allDays.length; i++) {
      let dayID = this.allDays[i]
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
              this.allProgress[dayID]["color"]= "\#2DBA61"
              this.allProgress[dayID]["fill"]= 100
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

    console.log(this.dividedDays[this.currentPage-1])
    this.stylesLoaded = true;
    
  }
  
}
