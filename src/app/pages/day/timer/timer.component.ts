import { Component } from '@angular/core';
import { TMDBService } from '../../../services/tmdb.service';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss'
})
export class TimerComponent {
  
  hours: string = "0";
  minutes: string = "0";
  seconds: string = "0";
  constructor(private tmdbServie: TMDBService) { }
  ngOnInit(): void {
    this.setTimer();
  }

  setTimer(){
    this.tmdbServie.getTimer().subscribe((nextDay) => {
      this.hours = nextDay.hours;
      this.minutes = nextDay.minutes;
      this.seconds = nextDay.seconds;
    });

    setInterval(() => {
      if (Number(this.seconds) > 0) {
        this.seconds = Number(this.seconds)-1 <10 ? "0"+(Number(this.seconds)-1).toString() : (Number(this.seconds)-1).toString();
      }
      else if (Number(this.minutes) > 0) {
        this.minutes = Number(this.minutes)-1 <10 ? "0"+(Number(this.minutes)-1).toString() : (Number(this.minutes)-1).toString();
        this.seconds = "59";
      }
      else if (Number(this.hours) > 0) {
        this.hours = Number(this.hours)-1 <10 ? "0"+(Number(this.hours)-1).toString() : (Number(this.hours)-1).toString();
        this.minutes = "59";
        this.seconds = "59";
      }
    }, 1000);

  }

  newDigits(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

}
