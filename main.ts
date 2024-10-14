let x = 0
let j = 0
let running = 0
let pid = 0
//  Player ID
let grid = [[0, 0], [2, 0], [4, 0], [0, 2], [2, 2], [4, 2], [0, 4], [2, 4], [4, 4]]
let known = ["", "", "", "", "", "", "", "", ""]
radio.setGroup(1)
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
    if (running == 0) {
        if (pid < 2) {
            pid += 1
        }
        
        basic.showNumber(pid)
    } else if (running == 1) {
        x += 1
        if (x >= 9) {
            x = 9
        }
        
        basic.showNumber(x)
    }
    
})
// reeset x
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    if (running == 0) {
        running += 1
    } else if (running == 1 && x > 0) {
        // start
        // only allow sending if the game is going
        radio.sendNumber(x)
        radio.sendValue("playerId", pid)
        x = 0
    }
    
})
radio.onReceivedNumber(function on_received_number(receivedNumber: number) {
    let running: number;
    let i: number;
    let k: number;
    
    if (receivedNumber == 0) {
        // check for end
        running = 0
        // end the game
        basic.clearScreen()
        basic.showString("game over")
        return
    }
    
    // stop the function
    if (running != 0) {
        if (receivedNumber < 10 && receivedNumber != 0) {
            basic.clearScreen()
            i = receivedNumber - 1
            // Get grid also the -1 is because computers start at 0 while people start at 1
            // so we subtract one to translate from human input to computer index 
            known[i] = "-"
            // Mark this grid as occupied           
            for (k = 0; k < 9; k++) {
                if (known[k] != "") {
                    led.plot(grid[k][0], grid[k][1])
                }
                
            }
            music.play(music.tonePlayable(Note.G4, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
            // just a sound to have a sort of audio feedback
            j = 0
            for (k = 0; k < 9; k++) {
                if (led.point(grid[k][0], grid[k][1])) {
                    j += 1
                }
                
            }
            // Count how full the grid is
            //  Send the count back to the server to be dsplayed
            radio.sendNumber(j + 10 * pid)
        }
        
    }
    
})
