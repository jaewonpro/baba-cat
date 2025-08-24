// move state - 0: idle, 1: walking, 2: dash (speed + atk)

// canvas trfm > body 
//  > trfm > upper leg > trfm > lower leg > trfm > foot
//  > trfm > tail
//  

/**
 * params
 * front leg root from body
 * front leg angle
 * back leg root from body
 * back leg angle
 * - walk
 * timeline divided into 4, each corresponds to a step,
 * each leg time diff is quarter the full timeline
 * 
 * # not for implementation but observation
 * - run 
 * > front two air > back two air > front two land > back two land
 * - walk > at times sync diagonal legs
 * > 
 */

const o = (() => {
    class Baba {

        state=[]; //[move, since]

        body; // [body_path]
        legs; // [leg_path]
        head; // [head]

        _draw(x) {
            
        }

        toState(state, now) {
            this.state[0] = state; 
            this.state[1] = now; 
        }

    }
})();