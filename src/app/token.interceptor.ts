// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
// import { KeycloakService } from 'keycloak-angular';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private keycloakService: KeycloakService) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     const token = this.keycloakService.getToken();
//     if (token) {
//       const clonedReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return next.handle(clonedReq);
//     }
//     return next.handle(req);
//   }
// }
