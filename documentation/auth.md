# Authentication

## Authentication API calls

The http requests for the authentication flow happen in the AuthService

## How Auth state is stored

The state for the authentication is an Object of type `Auth` which is stored in a BehaviourSubject called `authentication` in the AuthService, which is a singleton, so this is available to all places the service is dependency injected by default.

But the BehaviourSubject is private to encapsulate the emitting to only inside the service, but there is a public Observable which gets its value from the BehaviourSubject, this Observable is what other classes subscribe to.

## Login flow

When the login method is executed, the credentials will be sent to the API, in the case of a succesful response, it will take the JWT from the Authorization header, the username and the JWT expiration from the body, and create a new Auth object

This object is then saved in local storage.

If all goes correctly, the user is forwarded to the following feed.

## Auth retrieval when re-opening the website

When the user returns to the website, the auth state is obtained using the `retrieveAuthFromStorage()` method, which checks the expiry date, if its expired, it will delete the auth in storage and redirect the user to the login using the `logout()` method, if its still not expired, it will forward the user to the following feed.

## Register functionality

The register page is made up of 2 steps, when you load the register route, it will go to step 1, which is the input your details and desired username.

As you type your username, it will run a debounced request to check if its available, and will give feedback.

Then you submit that one, it will send the request to the server, in the case of success, it will change to the second step.

The second step is to input the verification code sent to the email, the user then submits it and sends the code, if all is correct, the user will be logged in and sent to the following feed. 

If a user previously did step 1 and is coming back later for step 2, adding the query param `?username=xxxxx` to the register route will take them to step 2 and allow them to send the verify request. This URL will be in the email with the code.

If someone does that with a username of an already verified and in-use account, the backend will return an error saying this is not allowed and display it on the form.

## Guard

The `isAuthedGuardCanActivate` guard, which in the `app.routes.ts` file is set for all routes except auth routes, simply gets the auth from the auth service, if there is auth, it does nothing. 

If auth is null, it will redirect to login.

## Interceptor

The `addTokenInterceptor` is used to add the JWT to all requests to the backend where they are neccessary.

It contains a list of API routes which shouldn't recieve a token, and does nothing if the request is going to any of those.