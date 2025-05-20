import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { from, Observable, switchMap } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private keycloakService: KeycloakService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = this.keycloakService.getToken();
//     console.log('Token:', token);

//     const resolvedtoken = await this.keycloakService.getToken(); // Ensure token is awaited
//     console.log('Resolved Token:', resolvedtoken); 

//     if (token) {
//       const cloned = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       return next.handle(cloned);
//     }
//     return next.handle(req);
//   }

//It will send the Token along with Http request to backend server 
// and in backend server the token will be verified whether the request is coming from valid resource
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return from(this.keycloakService.getToken()).pipe(
    switchMap((token) => {
      console.log('Resolved Token:', token); // Debugging output
      if (token) {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next.handle(cloned);
      }
      return next.handle(req);
    })
  );
}

}
