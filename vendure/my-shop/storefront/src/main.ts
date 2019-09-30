import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { loadAppConfig } from './app/app.config';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
    loadAppConfig()
        .then(() => platformBrowserDynamic().bootstrapModule(AppModule))
        .catch(err => {
            // tslint:disable:no-console
            console.log(err);
        });
});
