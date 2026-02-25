import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './com/fedex/shipment/app';
import { config } from './com/fedex/shipment/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(App, config, context);

export default bootstrap;
