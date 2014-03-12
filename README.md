# Dots and Boxes

A prototype multiplayer game, specially made for a talk at O'Reilly's FluentJS conference, 12 March 2014. Should run on your laptop with node.js, socket.io, and many modern handheld devices, such as Apple's iPhone, iPad, and iPod Touch.  (Compatiblity note: the Web browser on each handset must be able to handle sockets.)

## Intro

Some time ago I was fortunate enough to play [Renga](http://wallfour.co.uk/announce/renga/), at the Palo Alto International Film Festival.  Renga is a 100-player game, shown in a movie theater or other large space.  Players are handed laser pointers on the way in; they are the only I/O the game requires. In 90 minutes, this diverse crowd of strangers became a well-trained spaceship crew: we explored, mined asteroids, build a colony, defended it against marauders, and defeated the Big Boss at the end, which was a very near thing that does not happen for most audiences.

Naturally I thought "Hey! I should steal this idea!"

Fast-forward to Yahoo's Open Hack Day in Sunnyvale, last September. For the first time ever I was making something for Hack Day instead of running the thing, so I figured I'd give it a try.

So I installed node.js, got socket.io, made the demo by [Rob Hawkes](http://rawkes.com/articles/creating-a-real-time-multiplayer-game-with-websockets-and-node.html) come up and run.  Presto, dots on a screen!  But then:

* managing players
* death and dying
* collision detection
* scorekeeping
* addressing individual handsets from the server
* other stuff

Turns out this is hard.  Really, really, really freaking hard.  I've made games before, but only single-player things.  As soon as you introduce the second player to the screen, things get super-hairy.

## What I Made for Fluent

In the repo are three files.  In descending order of specialization, they are:

server.js - serves socket.io plus the client and console files.  Also directs traffic.  This could be used for many applications.

client.html - starts socket.io, puts a touchpad on the screen, sends new position to server.js if the player makes a new move or stops moving.

console.html - specially written to do nothing but run Dots and Boxes.

Important note: much (most) of this code is crap.  Please a) don't judge me by it and b) feel free to fix and ask for a merge!

## Important Things

