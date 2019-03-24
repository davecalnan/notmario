# Not-MarioⓇ
An experiment in implementing a basic physics engine, sprite-based graphics whilst definitely not infringing any trademarks.

# The goal
Figure out how to create a basic 2D rigid-body physics engine and work with HTML canvas & animation to emulate a popular game.

# What works
- [x] Basic physics engine. Collision detection and restitution (detecting is the easy part, figuring out what to do next, less so.) Not-MarioⓇ can climb walls at the moment which he probably shouldn't be able to.
- [x] Rendering physics-enabled entities on a HTML canvas.
- [x] Basic artwork (not my own.)
- [x] Parse and rendering a world of objects. Would be nice to be able to describe levels more succinctly, have larger than 1x1 objects, and pass props to objects.
- [x] Scrolling the viewport based on progress and skipping rendering out-of-viewport models. Not-MarioⓇ is a bit jittery when forcing scrolling (too much Red Bull?)

# What needs to be done
- [ ] Make interactable blocks interactable (I think there are coins in this game).
- [ ] Make player character power-up-able.
- [ ] Add enemies (scary) and interctions between multiple characters (including killing the player).
- [ ] Revoke the Not-MarioⓇ immortality dd the possiblility for the player character to die.
- [ ] Finish textures and graphics, including more sprites for player character (he should be able to look left, to start).
- [ ] Add a win state (yay).
- [ ] Add a way of playing on mobile?

# How to play
## Easy option
Go to [notmario.davecalnan.me](https://notmario.davecalnan.me) and play in the browser.

## Cool option
Download the repository and run locally.
```
git clone https://github.com/davecalnan/notmario.git

npm install

npm run dev
```
Then open [http://localhost:1234](http://localhost:1234) in your browser.

# How it (usually) works
## Initialising
### Game
The Game class is a bit of a God Object™️ to be honest. It sets up a few handy properties, creates a world instance, a player instance, adds event listeners and then starts animating.

### The World
The world instance figures out some dimensions and parses an array containing all of the blocks for the world, getting it ready to be drawn.

### The Player
Can't really do much yet. Later on can move, jump, and collide with things. Wow.

## Rendering
Each animation frame the game follows a straightforward update loop. It:
1. Handles the physics by:
  i) Moving all dynamic entities (just the player right now) based on their acceleration and derived velocity.
  ii) Detects all collisions between the dynamic entities and static entities. This could probably be optimised to skip unnecessary calculations (I get the feeling that's the bane of many game developers' existence.)
  iii) Resolves all collisions and tells the clumsy entities where they should move to, and how quickly they should go there.
2. Resets the canvas so it's nice and blank. A blank canvas, if you will. (Oh, you won't? My apologies.)
3. Scrolls the canvas if needs be to keep Not-MarioⓇ firmly on the screen.
4. Draws ownly the visible portion of the world in glorious Technicolour.

# Debugging
Want to "play" the "game" but with some numbers up the top left corner? Type `game.options.debug = true` in your browser console while playing.

# Notes
Some images graciously stolen from (this link)[https://imgur.com/a/FMKlQ].