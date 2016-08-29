# Brood: Play. Fight. Survive.
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

Find out more about the other on his [homepage](http://samaparl.com),
[LinkedIn](https://www.linkedin.com/in/sam-parl-6a3a4040)
or [AngelList](https://angel.co/samuel-parl).

## Rules and Technical Implementation
This game makes use of JavaScript, CSS, Canvas, and HTML with some jQuery.

Aliens position themselves as hexagons relative to each other and the top of the screen, while relying on the interior circle's area to test for collision.

The user can alternate between the structural view of the game, to observe the fundamental game logic, and the graphical alien view by clicking the check box marked "Structural View" beneath the game screen.

### Aliens
Aliens are passed through a staging array and three hashes throughout their life-cycle:

1. movingAliens
2. hangingAliens
3. deadAliens

Each category follows its own logic for rendering and collision testing purposes. For example, all aliens except those in the staging array are rendered at y-axis values relative to the falling night sky. Only movingAliens and hangingAliens are tested for collision against one another.

### Respect
Earn the respect of your neighbors by killing more aliens or executing cool moves. Every ricocheted shot will earn you 5 respect. Every dead alien earns you 10 respect. Respect is calculated on a round-by-round basis, where respect from each round is added to total respect, which accumulates until you lose.
