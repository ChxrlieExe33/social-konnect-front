# Pages of the application

The application will have the following pages

## Shared layout

The shared layout for all main pages will be as follows:

On large screens, a vertical navigation bar on the left side of the screen, then the content (posts / profile, etc) will be next to it.

On smaller screens, there will be a bottom navigation bar, dead center fixed at the bottom on scrolling.

The navigation links will be these in this order: Home / Following, Explore, Search, User profile, Create post.

## Main page / Following

The first page a user ends up on after authenticating, it will be a list of posts from users that the current user follows.

## Explore

It will be a list of posts aswell, but a mix from all users. 

## Search

Simple page where a user can search other users by username

## User profile

A page with the current user's information at the top, then a list of their posts below.

## New post

This page is for creating new posts.

## View other profile

This page won't be in the navbar, it will be reached by clicking a username or profile picture. It will still be on the main layout.

## Auth layout

Will be shared for auth related pages

## Log in

Used to authenticate

## Register

Used to register users

---

# Routes

This is going to be the route structure for each

- /auth
  - /login
  - /register
- /feed
  - /explore
  - /following
- /posts
  - /detail/:postId
- /search
- /create
- /profile
  - /me
  - /{username}

