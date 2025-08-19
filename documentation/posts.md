# Posts

## Retrieving posts

Depending on the feed or route in question, the posts are obtained in different ways.

### My profile page or other profile page

For these pages, the state for the currently loaded posts is stored in the route component, so when you navigate away, it is reloaded.

Using the `subscribeToFirstPosts()` or `subscribeToFirstUserPosts()` depending on which page, the first Page of posts is obtained.

When these pages are initialised, they start with a `nextPage` of 0, which is used in that first API call, and if in the response, the page data says that there is more pages, it will add 1 to the page value and keep the `nextPageExists` boolean as true.

If there is no next page according to the response, it will set `nextPageExists` to false.

On these routes, that next page exists boolean is passed down to the post list, which uses that to conditionally render the Get more posts button.

When the get more posts button is clicked, it emits an event which the page component listens to, when it emits, a subject will be emitted, which is subscribed to and using an exhaustMap, it performs the same service method call as the first, but passing the new next page value.

Then the data returned in the subscribe block is appended to the current loaded posts and handles the next page number check.

### For explore page or (currently non existent) following page

These ones have their loaded posts in BehaviourSubjects inside the PostService, which are exposed to other places via Observables.

When these pages are loaded they run a method like `getExplorePostsIfEmpty()`, which will check the state in the service, and return posts in state if there are any, if not, it will use the `getExplorePosts()` method to run the http request.

The idea of this is that the posts remain there if the user navigates between routes, until they refresh the browser.

The components themselves don't use any values returned from the methods for state, they simply subscribe to the observable in the PostService and use those and save them in a temporary signal in the component.

Then for pagination, the nextPage and nextPageExists for both feeds, will be stored in the service just like the state of posts, and will be passed in as Http params the same as with the profile feeds.

And it has exactly the same logic for checking if there is another page or not, to pass into each one's post list, to conditionally render the more posts button.