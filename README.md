In the near future mankind finally discovers proof of intelligent life - and
it's hostile!

Responding to SETI's broadcasts, a fleet of alien invaders has arrived in
Earth's atmosphere and wiped out most human infrastructure. Trapped in one of
the few pockets of survivors, you must fight to survive the onslaught. Luckily,
the aliens have an Achilles' heel - themselves.

Much like humanity in its isolated adolescence, the invaders have a tendency to
turn on each other when in large groups (three or more)! In a desperate move
after the destruction of most conventional weaponry, survivors have turned to
breeding the aliens and setting them loose to implode.

Fight to save humanity by strategically placing your alien brood among the
invaders for maximum effect!

Project MVP
In its minimal form, this game will include:
1.  The ability to shoot at least 4 different color aliens, chosen randomly on a
    turn-by-turn basis.
2.  4-sided aliens, with two areas of contact per side.
3.  Alien stickiness to each other (on contact with an area of contact) and the
    ceiling.
4.  The disappearance of all consecutive aliens when at least three have been
    placed in contact.
5.  The accumulation of points per alien kill.
6.  The endgame scenario when no aliens remain attached to the ceiling.

Technical Implementation
This game makes use of JavaScript, CSS, Canvas, and HTML with some jQuery.

Aliens position themselves as hexagons relative to each other and the top of the screen, while relying on the interior circle's area to test for collision.

The user can alternate between the structural view of the game, to observe the fundamental game logic, and the graphical alien view by clicking the check box marked "Structural View" beneath the game screen.

Aliens are passed through a staging array and three hashes throughout their life-cycles:

1. movingAliens
2. hangingAliens
3. deadAliens

Each category follows its own logic for rendering and collision testing purposes. For example, all aliens except those in the staging array are rendered at y-axis values relative to the falling night sky. Only movingAliens and hangingAliens are tested for collision against one another.

Implementation Timeline
Day 1
Creation and movement of aliens.

Day 2
Alien destructive rules and visuals.

Day 3
Game rules and layout
Gameplay modals:
* Start game
* You win!
* Try again!
