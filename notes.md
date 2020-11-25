## TODO
# add textController
( ) parse text
( ) generate actions

# create mapController and map transition functionality
( ) map controller which implements ITileMap
( ) create indoor map
( ) create map transition functionality

# screen dimensions : 10 * 9 tiles
# add color palette selection

## DONE
use ctx.globalCompositeOperation = 'destination-over' // new shapes are drawn behind the 
                                                      // existing canvas content

conditionally to draw bottom half of player underneath tall grass

canvas.style.backgroundColor = 'rgb(248,248,248)'

# implement a palette-based fade-out/fade-in sequence

# write function to convert player coordinates to map offset