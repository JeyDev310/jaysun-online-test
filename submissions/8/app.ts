import feathers, { HookContext } from '@feathersjs/feathers';
import '@feathersjs/transport-commons';
import express from '@feathersjs/express';

import { AccountService } from './services/account.service';
import { CampaignService } from './services/campaign.service';
import { ClickService } from './services/click.service';
import CampaignHook from './hooks/campaign.hook';
import AccountHook from './hooks/account.hook';

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());

// Express middleware to parse HTTP JSON bodies
app.use(express.json());
// Express middleware to parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Express middleware to to host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Configure Socket.io real-time APIs
// Register our messages service

app.use('/accounts', new AccountService());
app.use('/campaigns', new CampaignService());
app.use('/clicks', new ClickService());

// Express middleware with a nicer error handler
app.use(express.errorHandler());

// Hooks
app.service('/campaigns').hooks({
  before: {
    get: [ CampaignHook ]
  }
});

app.service('/accounts').hooks({
  after: {
    find: [ AccountHook ]
  }
})

// Start the server
app.listen(3030).on('listening', () =>
  console.log('Feathers server listening on localhost:3030')
);
