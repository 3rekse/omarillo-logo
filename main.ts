let myOmarillo2 = Omarillo.fromSprite(sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . 8 8 8 . . . . . . . . 
    . . . . 8 8 8 8 8 . . . . . . . 
    . . 8 8 8 8 8 8 8 8 8 . . . . . 
    . 8 8 8 8 6 6 6 8 8 8 8 . . . . 
    . 8 8 6 6 6 6 6 6 6 8 8 8 8 8 8 
    . 8 8 8 6 6 6 6 6 6 6 6 6 6 6 8 
    . 8 8 8 8 6 6 6 8 8 8 8 8 8 8 8 
    . . 8 8 8 8 8 8 8 8 8 . . . . . 
    . . . . 8 8 8 8 8 . . . . . . . 
    . . . . . 8 8 8 . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
`, SpriteKind.Player))
myOmarillo2.setPositionCartesian(-40, 20)
myOmarillo2.setSpeed(98)
for (let index = 0; index < 35; index++) {
    myOmarillo2.moveDirection(OmarilloDirection.Forward, 75)
    myOmarillo2.turnDirectionByDegrees(OmarilloTurnDirection.Right, 130)
}
