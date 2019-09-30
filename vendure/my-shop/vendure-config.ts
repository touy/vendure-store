import {
    examplePaymentHandler,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core'; 
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';

export const config: VendureConfig = {
    authOptions: {
        sessionSecret: '3vxpc7uxj',
    },
    port: 3000,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: true, // turn this off for production
        logging: false,
        database: 'vendure',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'vendure/assets'),
            port: 3001,
        }),
        DefaultSearchPlugin,
        EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, 'vendure/email/test-emails'),
            mailboxPort: 3003,
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, 'vendure/email/templates'),
            globalTemplateVars: {
                // The following variables will change depending on your storefront implementation
                fromAddress: '"example" <noreply@example.com>',
                verifyEmailAddressUrl: 'http://localhost:8080/verify',
                passwordResetUrl: 'http://localhost:8080/password-reset',
                changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
            },
        }),
        AdminUiPlugin.init({ port: 3002 }),
    ],
};
