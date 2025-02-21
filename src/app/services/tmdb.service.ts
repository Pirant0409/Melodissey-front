import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { MovieInterface } from '../interfaces/movie-interface';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DayInterface } from '../interfaces/day-interface';
import { RawMoviesInterface } from '../interfaces/raw-movies-interface';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})

export class TMDBService {
  // private apiUrl = "http://127.0.0.1:8000"
  private apiUrl = environment.API_URL;
  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Accept', 'application/json');

  constructor(private http:HttpClient) { }
  
  searchMovies(query:string):Observable<MovieInterface[]>{
    const requestURL = `${this.apiUrl}/search/${query}`
    return this.http.get<MovieInterface[]>(requestURL,{headers:this.headers}).pipe(response => {
      console.log(response)
      return response;
    });
  }

  getAllids(): Observable<number[]> {
    const requestURL = `${this.apiUrl}/days`
    return this.http.get<number[]>(requestURL, { headers: this.headers }).pipe(response => {
      return response;
      });
    };
  
  getAllRoomids(): Observable<string[]> {
    const requestURL = `${this.apiUrl}/rooms`
    return this.http.get<string[]>(requestURL, { headers: this.headers }).pipe(response => {
      return response;
      });
  }

  getYTBid(dayID:number): Observable<any> {
    const requestURL=`${this.apiUrl}/days/${dayID}`
    return this.http.get(requestURL, { headers: this.headers }).pipe(map((response:any) => {
      return response;
    }))
  }

  getRoomYTBid(roomID:string): Observable<any> {
    const requestURL=`${this.apiUrl}/rooms/${roomID}`
    return this.http.get(requestURL, { headers: this.headers , observe: 'response'}).pipe(map((response:any) => {
      return {"detail": response.body.detail, "status": response.status, "ytbID":response.body.ytbID};
    }),
    catchError((error) => {
      return of({"detail":error.error.detail, "status":error.status})
    }))
  }

  sendGuess(dayID:number, guess:MovieInterface,hint:number): Observable<any> {
    const params=`?media=${guess.media}&tmdbid=${guess.tmdbID}&collection=${guess.collection}&hint=${hint}`
    const requestURL=`${this.apiUrl}/check/${dayID}${params}`
    console.log(requestURL)
    return this.http.get(requestURL, { headers: this.headers }).pipe(map((response:any) => {
      return response;
    }))
  }

  sendRoomGuess(roomID:string, guess:MovieInterface,hint:number): Observable<any> {
    const params=`?media=${guess.media}&tmdbid=${guess.tmdbID}&collection=${guess.collection}&hint=${hint}`
    const requestURL=`${this.apiUrl}/checkRoom/${roomID}${params}`
    console.log(requestURL)
    return this.http.get(requestURL, { headers: this.headers }).pipe(map((response:any) => {
      return response;
    }))
  }

  getAnswer(dayID:number): Observable<any> {
    const requestURL=`${this.apiUrl}/check/${dayID}?answer=true`
    return this.http.get(requestURL, { headers: this.headers }).pipe(map((response:any) => {
      return response;
    }))
  }

  getStats(dayID:number): Observable<any> {
    const requestURL=`${this.apiUrl}/stats/${dayID}`
    return this.http.get(requestURL, { headers: this.headers }).pipe(map((response:any) => {
      return response;
    }))
  }

  login(password:string): Observable<any> {
    const requestURL=`${this.apiUrl}/admin/login`
    //return response of request or error
    return this.http.post(requestURL, {password}, { headers: this.headers, observe: 'response' }).pipe(map((response:any) => {
      return {"token":response.body.token, "status":response.status};
    }),
    catchError((error) => {
      return of({"detail":error.error.detail, "status":error.status})
    }));
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if(!token){
      console.log('no token found')
      return of(false);
    } 
    
    const tokenVerifURL = `${this.apiUrl}/admin/protected`	
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(tokenVerifURL, { headers: this.headers }).pipe(map((response:any) => {
      console.log(response)
      return true;
    }),
    catchError((error) =>{
      console.error(error);
      return of(false)
    }));
  }

  getAllDays(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token){
      return of(false);
      
    } 

    const requestURL = `${this.apiUrl}/allDays`
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    return this.http.get(requestURL, { headers: this.headers, }).pipe(response => {
      return response;
    });
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token){
      return of(false);
      
    } 
    
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    const requestURL = `${this.apiUrl}/allMovies`
    return this.http.get(requestURL, { headers: this.headers }).pipe(response => {
      return response;
    });
  }

  updateDay(newDay: DayInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token){
      return of(false);      
    }
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    const requestURL = `${this.apiUrl}/days/`
    return this.http.put(requestURL, JSON.stringify(newDay), { headers: this.headers, observe: 'response'  }).pipe(map((response:any) => {
      return {"detail": response.body.detail, "status": response.status};
    }),
    catchError((error) => {
      return of({"detail":error.error.detail, "status":error.status});
    }));
  }

  updateMovie(newMovie: RawMoviesInterface): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token){
      return of(false);      
    }
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    const requestURL = `${this.apiUrl}/movies/`
    return this.http.put(requestURL, JSON.stringify(newMovie), { headers: this.headers, observe: 'response'  }).pipe(map((response:any) => {
      return {"detail": response.body.detail, "status": response.status};
    }),
    catchError((error) => {
      return of({"detail":error.error.detail, "status":error.status});
    }));
  }

  createRoom(roomData:any): Observable<any> {
    const requestURL = `${this.apiUrl}/createRoom/`
    return this.http.post(requestURL, JSON.stringify(roomData), { headers: this.headers, observe: 'response'  }).pipe(map((response:any) => {
      return {"detail": response.body.detail,"roomID": response.body.roomID, "status": response.status};
    }),
    catchError((error) => {
      console.log(error.error.detail)
      return of({"detail":error.error.detail, "status":error.status});
    }));
  }

  getTimer(): Observable<any> {
    const requestURL = `${this.apiUrl}/timer/`
    return this.http.get(requestURL, { headers: this.headers, observe: 'response' }).pipe(map((response:any) => {
      return {"detail": response.body.detail, "status": response.status, "hours":response.body.hours, "minutes":response.body.minutes, "seconds":response.body.seconds};
    }),
    catchError((error) => {
      return of({"detail":error.error.detail, "status":error.status});
    }));
  }

  restoreDB(db:any):Observable<any>{
    const token = localStorage.getItem('token');
    if(!token){
      return of(false);      
    }
    this.headers = this.headers.set('Authorization', `Bearer ${token}`);
    const requestURL = `${this.apiUrl}/restoreDB/`
    console.log(db)
    return this.http.post(requestURL, JSON.stringify(db), { headers: this.headers, observe: 'response' }).pipe(map((response:any) => {
      return {"detail": response.body.detail, "status": response.status};
    }),
    catchError((error) => {
      return of({"detail":error.error.detail, "status":error.status});
    }));
  }
}
