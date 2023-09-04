import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';


import { catchError, finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';


@Injectable()


export class JwtInterceptor implements HttpInterceptor {
    
    constructor(private authenticationService:AuthenticationService,private router: Router) { }
        private handleAuthError(err: HttpErrorResponse): Observable<any> {
            
            //handle your auth error or rethrow
            if (err.status === 401 || err.status === 403 || err.status === 0) {
                //navigate /delete cookies or whatever
                this.router.navigateByUrl(`/login`);
                // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
                return of(err.message); // or EMPTY may be appropriate here
            }
            return throwError(err);
        }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        

        //this.loadService.show()
        const currentUser = this.authenticationService.currentUserValue;
        const isLoggedIn = currentUser && currentUser.Token;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.Token}`
                }
            });
        }


        
        // catch the error, make specific functions for catching specific errors and you can chain through them with more catch operators
        return next.handle(request).pipe(
            finalize(() => {
                //this.loadService.hide();
            }),
            catchError(x=> this.handleAuthError(x))
        ); //here use an arrow function, otherwise you may get "Cannot read property 'navigate' of undefined" on angular 4.4.2/net core 2/webpack 2.70

        
    }
}
