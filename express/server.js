'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');

// const ApolloClient = require('apollo-client').ApolloClient;
// const gql = require('graphql-tag');
// const fetch = require('cross-fetch/polyfill').fetch;
// const createHttpLink = require('apollo-link-http').createHttpLink;
// const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;

const router = express.Router();

// const client = new ApolloClient({
//   link: createHttpLink({
//     uri: 'https://pleyap.hasura.app/v1/graphql',
//     fetch: fetch,
//     headers: {
//       "content-type": "application/json",
//       "x-hasura-admin-secret": "Ssiigo@01"
//     },
//   }),
//   cache: new InMemoryCache()
// });

router.post('/hasura-user-sync-registration-pleyap', (req, res) => {

  const userId = req.body.event.user.id;
  const firstName = req.body.event.user.firstName;
  const lastName = req.body.event.user.lastName;
  const picture = req.body.event.user.imageUrl;

  console.log(userId + "\n" + firstName + "\n" + lastName + "\n" + picture);

  const mutation = `mutation (
    $user_id: String,
		$last_name: String,
		$first_name: String,
		$profileUrl: String) {
      insert_pleyap_datastore_Profile(objects: [{
        user_id: $user_id,
        lastName: $last_name,
        firstName: $first_name
        profileUrl: $profileUrl
      }],
        on_conflict: {
          constraint: profile_pk,
          update_columns: [last_seen, lastName, firstName]
        }) {
        affected_rows
      }
  }`;

  request.post(
    {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "Ssiigo@01"
      },
      url: "https://pleyap.hasura.app/v1/graphql",
      body: JSON.stringify({
        query: mutation,
        variables: {
          "user_id": userId,
          "first_name": firstName,
          "last_name": lastName,
          "profileUrl": picture
        }
      })
    },
    function(error, response, body) {
      console.log(body);
      console.error(error);
    }
  );

  res
	.status(200)
	.json({ postBody: req.body.event });
});

router.post('/hasura-user-sync-registration-pleyap-admin', (req, res) => {

  const userId = req.body.event.user.id;
  const firstName = req.body.event.user.firstName;
  const lastName = req.body.event.user.lastName;
  const picture = req.body.event.user.imageUrl;

  console.log(userId + "\n" + firstName + "\n" + lastName + "\n" + picture);

  const mutation = `mutation (
    $user_id: String,
		$last_name: String,
		$first_name: String,
		$profileUrl: String) {
      insert_pleyap_datastore_Profile(objects: [{
        user_id: $user_id,
        lastName: $last_name,
        firstName: $first_name
        profileUrl: $profileUrl
      }],
        on_conflict: {
          constraint: profile_pk,
          update_columns: [last_seen, lastName, firstName]
        }) {
        affected_rows
      }
  }`;

  request.post(
    {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "Ssiigo@01"
      },
      url: "https://pleyap.hasura.app/v1/graphql",
      body: JSON.stringify({
        query: mutation,
        variables: {
          "user_id": userId,
          "first_name": firstName,
          "last_name": lastName,
          "profileUrl": picture
        }
      })
    },
    function(error, response, body) {
      if (response.statusCode == 200) {
        addBarberShop(req);
      } else {
        console.error(error);
      }
      console.log(response.statusCode);
    }
  );

  res
	.status(200)
	.json({ postBody: req.body.event });
});

router.post('/hasura-user-sync-login', (req, res) => {

  const userId = req.body.event.user.id;
  const firstName = req.body.event.user.firstName;
  const lastName = req.body.event.user.lastName;
  const picture = req.body.event.user.imageUrl;

  console.log("UID: " + userId);

  const mutation = `mutation (
    $user_id: String,
		$last_name: String,
		$first_name: String,
		$profileUrl: String) {
      insert_pleyap_datastore_Profile(objects: [{
        user_id: $user_id,
        lastName: $last_name,
        firstName: $first_name
        profileUrl: $profileUrl
      }],
        on_conflict: {
          constraint: profile_pk,
          update_columns: [last_seen, profileUrl]
        }) {
        affected_rows
      }
  }`;

  request.post(
    {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "Ssiigo@01"
      },
      url: "https://pleyap.hasura.app/v1/graphql",
      body: JSON.stringify({
        query: mutation,
        variables: {
          "user_id": userId,
          "first_name": firstName,
          "last_name": lastName,
          "profileUrl": picture
        }
      })
    },
    function(error, response, body) {
      console.log(body);
      console.error(error);
    }
  );

  res
	.status(200)
	.json({ postBody: req.body.event });
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

function addBarberShop(req) {
  const userId = req.body.event.user.id;
  const barber_shop_name = req.body.event.registration.data.barber_shop_name;
  const barber_shop_phone = req.body.event.registration.data.barber_shop_phone;
  const barber_shop_address = req.body.event.registration.data.barber_shop_address;

  // console.log(userId + "\n" + barber_shop_name + "\n" + barber_shop_phone + "\n" + barber_shop_address);

  const mutation = `
    mutation AddBarberShop($barberShop: pleyap_datastore_BarberShop_insert_input!) {
      insertOneBarberShop(object: $barberShop) {
        affected_rows
      }
    }
  `;

  request.post(
    {
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "Ssiigo@01"
      },
      url: "https://pleyap.hasura.app/v1/graphql",
      body: JSON.stringify({
        query: mutation,
        variables:{
          "barberShop": {
            "name": barber_shop_name,
            "phone": barber_shop_phone,
            "address": barber_shop_address,
            "ownerId": userId
            // "ownerId": userId
          }
        }
      })
    },
    function(error, response, body) {
      console.log(body);
      console.error(error);
    }
  );
}

module.exports = app;
module.exports.handler = serverless(app);
