import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  let request = req
 	 if (req.method === "GET" || req.method === "PUT") {	
    const token = localStorage.getItem(environment.tokenKey)
    if (token) {
      request = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })
    }
   }

   return next(request);
};

