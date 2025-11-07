'use strict';

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

const color = {
  grey: 0,
  red: 1,
  yellow: 2,
  green: 3
};

const poetrySlamStatusCode = {
  inPreparation: 1,
  published: 2,
  booked: 3,
  canceled: 4
};

const visitStatusCode = {
  booked: 1,
  canceled: 2
};

const httpCodes = {
  ok: 200,
  ok_no_content: 204,
  bad_request: 400,
  forbidden: 403,
  not_found: 404,
  method_not_allowed: 405,
  conflict: 409,
  internal_server_error: 500
};

const httpRequestMethod = {
  post: 'POST',
  get: 'GET'
};

// Publish constants and functions
module.exports = {
  color,
  poetrySlamStatusCode,
  visitStatusCode,
  httpCodes,
  httpRequestMethod
};
