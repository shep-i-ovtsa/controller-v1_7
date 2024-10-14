x = 0
j = 0
running = 0 
pid = 0  # Player ID
grid = [[0, 0],[2, 0],[4, 0],[0, 2],[2, 2],[4, 2],[0, 4],[2, 4],[4, 4]]
known = ["","","","","","","","","",]  
radio.set_group(1)
def on_button_pressed_a():
    global pid, x
    if running == 0:
        if pid < 2:
            pid += 1  
        basic.show_number(pid)
    elif running == 1:  
        x += 1
        if x >= 9:
            x = 9
        basic.show_number(x)

input.on_button_pressed(Button.A, on_button_pressed_a)

def on_button_pressed_b():
    global running, x
    if running == 0:
        running += 1#start
    elif running == 1 and x > 0: #only allow sending if the game is going
        radio.send_number(x)
        radio.send_value("playerId", pid)
        x = 0  #reeset x

input.on_button_pressed(Button.B, on_button_pressed_b)

def on_received_number(receivedNumber):
    global j
    if receivedNumber == 0:#check for end
        running = 0 #end the game
        basic.clear_screen()
        basic.show_string("game over")
        return #stop the function
    
    if running != 0:
        if receivedNumber < 10 and receivedNumber != 0:
            basic.clear_screen()
            i = receivedNumber - 1 #Get grid also the -1 is because computers start at 0 while people start at 1
            #so we subtract one to translate from human input to computer index 
            known[i] = "-"#Mark this grid as occupied           
            for k in range(9):
                if known[k] != "":
                    led.plot(grid[k][0], grid[k][1])
            music.play(music.tone_playable(Note.G4, music.beat(BeatFraction.WHOLE)), music.PlaybackMode.UNTIL_DONE)
            #just a sound to have a sort of audio feedback
            j = 0
            for k in range(9):
                if led.point(grid[k][0], grid[k][1]):
                    j += 1#Count how full the grid is
            
            # Send the count back to the server to be dsplayed
            radio.send_number(j + (10 * pid))

radio.on_received_number(on_received_number)