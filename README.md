It is recommended to use a recent version of Chromium (Chrome/Edge). Unfortunately, Safari won't work.

Click here to play [https://sauron65.github.io/game-thng/game.html](https://sauron65.github.io/game-thng/game.html)

# Controls

## keyboard

- (space): jump
- ↑(up arrow): enter door
- →(right arrow): move right
- ←(left arrow): move left
- A: sprint

## XBOX controller (connect with bluetooth)

- A: jump
- left joystick: move
- left joystick (up): enter door
- X: sprint


# For local development/hosting,

1. ```git clone https://github.com/sauron65/game-thng.git```
2. ```cd game-thng```
3. ```npm install```
4. ```node index.js```
5. go to [https://localhost:500/game.html](https://localhost:500/game.html)

defaults to port 500 <br/>
select a different port:
```PORT=8080 node index.js```