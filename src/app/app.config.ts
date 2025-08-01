import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './interceptors/error.interceptor';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimeagoModule } from 'ngx-timeago';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])
    ),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
    }),
    importProvidersFrom(
      NgxSpinnerModule,
      ModalModule.forRoot(),
      TimeagoModule.forRoot()
    ),
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: false,
        imageSize: 'contain',
      } as GalleryConfig,
    },
  ],
};
