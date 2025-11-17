/**
 * Extension for scaling and rotating. Inspired by @ChaseMor
 * https://github.com/ChaseMor/pxt-arcade-rotsprite
 */
//% weight=0 color=#b8860b icon="\uf021" block="Sprite Transforms"
//% advanced=true
/**
 * Logo Omarillo graphics blocks
 * Created by: Mr. Coxall
 * Created on: Feb 2021
 * 
 *  Another implimentation of Logo Omarillo
 *  - starting code taken from: https://github.com/microsoft/pxt-screen-omarillo
 *  - needed to have a reduced set of instructions
 */
//% weight=100 color=#0f9c11 icon="\uf188"
//% groups='[]'

enum OmarilloPenMode {
    //% block="down"
    Down,
    //% block="up"
    Up,
    //% block="erase"
    Erase
}

enum OmarilloTurnDirection {
    //% block="right"
    Right,
    //% block="left"
    Left
}

enum OmarilloDirection {
    //% block="forward"
    Forward,
    //% block="backward"
    Backward
}

/**
 * A omarillo that can move a sprite
 */
class Omarillo {
    color: number = 1;
    direction: number = 0; // degrees -> starting direction is to the right
    penMode: OmarilloPenMode = OmarilloPenMode.Down;
    delay = 10;
    sprite: Sprite;
    bkg: Image;

    constructor(sprite: Sprite, bkg: Image) {
        this.sprite = sprite;
        this.bkg = bkg;
        this.sprite.data[omarillo.DATA_KEY] = this;
    }

    /**
     * Gets the horizontal coordinate of the center of the omarillo
     */
    get x() {
        return this.sprite.x;
    }

    set x(value: number) {
        this.sprite.x = value;
    }

    /**
     * Gets the vertical coordinate of the center of the omarillo
     */
    get y() {
        return this.sprite.y;
    }

    set y(value: number) {
        this.sprite.y = value;
    }

    // block no longer shown to user, but might still be called by other blocks

    /**
     * Moves the omarillo for the given amount of pixels
     * @param steps number of steps, eg: 1
     */
    // blockId=omarilloSpriteForward block="$this(myOmarillo) forward %steps steps"
    //% weight=99 blockGap=8
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    forward(steps: number): void {
        if (!steps) return;

        const drad = this.direction * omarillo.DEG_TO_RAD;
        const sn = Math.sign(steps)
        const dx = Math.cos(drad) * sn
        const dy = - Math.sin(drad) * sn
        const n = Math.abs(steps);
        const c = this.penMode == OmarilloPenMode.Down ? this.color : 0;

        const firstX = this.x;
        const firstY = this.y;
        let oldX = firstX;
        let oldY = firstY;

        if (this.delay > 1) {
            // animating move...
            for (let i = 0; i < n; ++i) {
                // paint if pen down
                if (this.penMode == OmarilloPenMode.Down || this.penMode == OmarilloPenMode.Erase)
                    this.bkg.drawLine(oldX, oldY, this.x, this.y, c)
                // paint and update
                this.setPosition(this.x + dx, this.y + dy);
                // and wait
                pause(this.delay);

                oldX = this.x;
                oldY = this.y;
            }
        }

        // adjust final position
        this.setPosition(Math.round(firstX + dx * n), Math.round(firstY + dy * n))
        // paint if pen down
        if (this.penMode == OmarilloPenMode.Down || this.penMode == OmarilloPenMode.Erase)
            this.bkg.drawLine(oldX, oldY, this.x, this.y, c)
        // and wait
        pause(this.delay);
    }

    /**
     * Moves back by the given number of steps
     * @param steps number of steps to move, eg: 1
     */
    // blockId=omarilloSpriteBack block="$this(myOmarillo) back %steps steps"
    //% weight=98 blockGap=8
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    back(steps: number): void {
        this.forward(-steps);
    }

    /**
     * Turns the omarillo
     */
    // blockId=omarilloSpriteturn block="$this(myOmarillo) turn %degrees"
    //% degrees.min=-180 degrees.max=180
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    turn(degrees: number): void {
        this.direction = (this.direction + degrees) % 360;
    }

    // block that are shown to user

    /**
     * Moves omarillo object direction by the given number of steps, in the given direction.
     * @param direction to move in, eg: forwards
     * @param steps number of steps to move, eg: 25
     */
    //% blockId=omarilloSpriteMoveDirection block="$this(myOmarillo) move %direction %steps steps"
    //% steps.defl=25
    //% weight=19
    //% blockGap=8
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    moveDirection(direction: OmarilloDirection, steps: number): void {
        if (direction == OmarilloDirection.Forward) {
            this.forward(steps);
        } else {
            this.forward(-steps);
        }
    }

    /**
     * Turns the omarillo object direction and degrees.
     */
    //% blockId=omarilloSpriteTurnByDirectionAndDegrees block="$this(myOmarillo) turn %direction by %degrees°"
    //% weight=18
    //% blockGap=8
    //% direction
    //% degrees.min=0 degrees.max=360
    //% direction.defl=Right
    //% degrees.defl=90
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    turnDirectionByDegrees(direction: OmarilloTurnDirection, degrees: number): void {
        if (direction == OmarilloTurnDirection.Left) {
            this.direction = (this.direction + degrees) % 360;
            transformSprites.rotateSprite(this.sprite, (-1 * this.direction))
        } else {
            this.direction = (this.direction - degrees) % 360;
            transformSprites.rotateSprite(this.sprite, (-1 * this.direction))
        }
        
    }

    /**
     * Display a speech bubble with the text, for the given time.
     * @param text the text to say, eg: "Hello, World!"
     * @param time time to keep text on
     */
    //% blockGap=8
    //% weight=17
    //% blockId=omarillospritesay block="$this(myOmarillo) says %text||for %millis ms"
    //% text.defl="Hello, World!"
    //% timeOnScreen.defl=5000
    //% millis.shadow=timePicker
    //% text.shadow=text
    //% inlineInputMode=inline
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    say(text: any, timeOnScreen?: number, textColor = 15, textBoxColor = 1) {
        //this.sprite.say(text, timeOnScreen || 5000, textColor, textBoxColor);
        this.sprite.say(text, timeOnScreen, textColor, textBoxColor);
    }

    /**
     * Puts the omarillo's pen down or up.
     */
    //% blockGap=8
    //% blockId=omarilloSpritePen block="$this(myOmarillo) pen %mode"
    //% mode.defl=OmarilloPenMode.Up
    //% weight=16
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    pen(mode: OmarilloPenMode): void {
        this.penMode = mode;
    }

    /**
     * Sets the omarillo's pen color.
     */
    //% blockGap=8
    //% blockId=omarillospritesetpencolor block="$this(myOmarillo) set pen color to %color=colorindexpicker"
    //% color.defl=1
    //% weight=15
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    setPenColor(color: number) {
        this.color = color & 0xf;
    }

    /**
     * Moves the omarillo to the center of the screen.
     */
    //% blockGap=8
    //% blockId=omarilloSpriteHome block="$this(myOmarillo) home"
    //% weight=13
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    home(): void {
        this.setPosition(80, 60);
        this.direction = 0;
        this.turnDirectionByDegrees(OmarilloTurnDirection.Right, 0)
    }

    /**
     * Sets the omarillo position.
     * @param x the horizontal position from 0 (left) to 160 (right), eg: 2
     * @param y the vertical position from 0 (top) to 120 (bottom), eg: 2
     */
    //% x.min=0 x.max=160
    //% y.min=0 y.max=120
    // blockId=omarilloSpriteSetPosition block="$this(myOmarillo) set position x %x y %y"
    //% weight=12
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    setPosition(x: number, y: number): void {
        this.x = x % screen.width; 
        if (this.x < 0) 
            this.x += screen.width;
        this.y = y % screen.height; 
        if (this.y < 0) 
            this.y += screen.height;
    }

    /**
     * Sets the omarillo position, to cartesian coordinates. 
     * @param x the horizontal position from -80 (left) to 80 (right), eg: 0
     * @param y the vertical position from -60 (top) to 60 (bottom), eg: 0
     */
    //% x.min=-80 x.max=80
    //% y.min=-60 y.max=60
    //% blockId=omarilloSpriteSetPositionCartesian block="$this(myOmarillo) set position x %x y %y"
    //% weight=12
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    setPositionCartesian(x: number, y: number): void {
        x = x + 80
        y = 60 - y

        // to avoid screen wrapping
        if (y == 120) {
            y = 119
        }
        if (x == 160) {
            x = 159
        }

        this.setPosition(x, y);
    }

    /**
     * Stamps the image at the current omarillo's position.
     * @param image 
     */
    //% blockGap=8
    //% _blockId=omarillospritestamp block="$this(myOmarillo) stamp %image=screen_image_picker"
     //% weight=11
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    stamp(image: Image) {
        this.bkg.drawImage(image, this.sprite.left + ((this.sprite.width - image.width) >> 1), this.sprite.top + ((this.sprite.height - image.height) >> 1));
        pause(this.delay);
    }

    /**
     * Define the steps per second.
     * @param speed eg: 50
     */
    //% blockGap=8
    //% blockId=omarilloSpriteSetSpeed block="$this(myOmarillo) set speed %speed"
    //% speed.min=1 speed.max=100
    //% weight=10
    //% group="Sprite Commands"
    //% blockNamespace="omarillo"
    setSpeed(speed: number): void {
        this.delay = 100 - Math.max(1, Math.min(100, speed | 0));
    }
}

/**
 * Omarillo graphics blocks
 */
//% weight=100 color=#0f9c11 icon="\uf188"
//% groups='["Omarillo Commands", "Sprite Commands"]'
namespace omarillo {
    export const DATA_KEY = "omarillo"
    export const DEG_TO_RAD =  Math.PI / 180;

    export let omarilloImage = img`
    . . 2 2 2 . .
    . 2 2 2 2 2 .
    2 2 2 2 2 2 2
    . 2 2 2 2 2 .
    . . 2 2 2 . .
    `;        
    export let backgroundColor = 0xf;

    let _bkg: Image;
    function bkg() {
        if (!_bkg) {
            _bkg = scene.backgroundImage();
            _bkg.fill(omarillo.backgroundColor);
        }
        return _bkg;
    }

    let _omarillo: Omarillo;
    function init() {
        if (!_omarillo) {
            _omarillo = fromSprite(sprites.create(omarillo.omarilloImage.clone()))
            home()
        }
    }

    // blocks no longer used but might be called by exported blocks

    /**
     * Moves the omarillo for the given amount of pixels
     * @param steps number of steps, eg: 1
     */
    // blockId=omarilloForward block="forward %steps steps"
    //% weight=99 blockGap=8
    //% group="Omarillo Commands"
    export function forward(steps: number): void {
        init();
        _omarillo.forward(steps);
    }

    /**
     * Moves back by the given number of steps
     * @param steps number of steps to move, eg: 1
     */
    // blockId=omarilloBack block="back %steps steps"
    //% weight=98 blockGap=8
    //% group="Omarillo Commands"
    export function back(steps: number): void {
        forward(-steps);
    }

    /**
     * Turns the omarillo
     */
    // blockId=omarilloturn block="turn %degrees"
    //% degrees.min=-180 degrees.max=180
    //% group="Omarillo Commands"
    export function turn(degrees: number): void {
        init();
        _omarillo.turn(degrees);
    }

    // blockId=omarillorightturn block="turn right %degrees"
    //% group="Omarillo Commands"
    export function rt(degrees : number): void{
        turn(-degrees)
    }

    // blockId=omarilloleftturn block="turn left %degrees"
    //% group="Omarillo Commands"
    export function lt(degrees : number): void{
        turn(degrees)
    }

    /**
     * Sets the omarillo position
     * @param x the horizontal position from 0 (left) to 160 (right), eg: 2
     * @param y the vertical position from 0 (top) to 120 (bottom), eg: 2
     */
    //% x.min=0 x.max=160
    //% y.min=0 y.max=120
    // blockId=omarilloSetPosition block="set position x %x y %y"
    //% weight=87
    //% group="Omarillo Commands"
    export function setPosition(x: number, y: number): void {
        init();
        _omarillo.setPosition(x, y)
    }

    // blocks visible to user

    /**
     * Show the omarillo, if not already on the screen.
     */
    //% blockId=showOmarillo block="show omarillo"
    //% sprite.shadow=spritescreate
    //% weight=50 
    //% blockGap=8
    //% group="Omarillo Commands"
    export function showOmarillo(): void {
        init();
    }

    /**
     * Moves omarillo by the given number of steps, in the given direction.
     * @param direction to move in, eg: forwards
     * @param steps number of steps to move, eg: 25
     */
    //% blockId=omarilloMoveDirection block="move omarillo %direction %steps steps"
    //% steps.defl=25
    //% weight=49
    //% blockGap=8
    //% group="Omarillo Commands"
    //% blockNamespace="omarillo"
    export function moveOmarilloDirection(direction: OmarilloDirection, steps: number): void {
        init();
        if (direction == OmarilloDirection.Forward) {
            _omarillo.forward(steps);
        } else {
            _omarillo.forward(-steps);
        }
    }

    /**
     * Turns the omarillo right or left by the given degrees.
     */
    //% blockId=omarilloTurnByDirectionAndDegrees block="turn omarillo %direction by %degrees°"
    //% weight=48
    //% blockGap=8
    //% direction
    //% degrees.min=0 degrees.max=360
    //% direction.defl=Right
    //% degrees.defl=90
    //% group="Omarillo Commands"
    //% blockNamespace="omarillo"
    export function turnOmarilloDirectionByDegrees(direction: OmarilloTurnDirection, degrees: number): void {
        init();
        if (direction == OmarilloTurnDirection.Left) {
            _omarillo.turn(degrees);
        } else {
            _omarillo.turn(-degrees);
        }
        transformSprites.rotateSprite(_omarillo.sprite, (-1 * _omarillo.direction))
    }

    /**
     * Display a speech bubble with the given text, for the given time.
     * @param text the text to say, eg: "Hello, World!"
     * @param time time to keep text on
     */
    //% weight=47
    //% blockId=omarillosay block="omarillo says %text||for %millis ms"
    //% text.defl="Hello, World!"
    //% timeOnScreen.defl=5000
    //% millis.shadow=timePicker
    //% text.shadow=text
    //% inlineInputMode=inline
    //% group="Omarillo Commands"
    //% blockNamespace="omarillo"
    export function say(text: any, timeOnScreen?: number, textColor = 15, textBoxColor = 1) {
        init()
        _omarillo.say(text, timeOnScreen, textColor, textBoxColor)
    }

    /**
     * Puts the omarillo's pen down, up or as an eraser.
     */
    //% blockGap=8
    //% blockId=omarilloPen block="set omarillo's pen %mode"
    //% mode.defl=OmarilloPenMode.Up
    //% weight=46
    //% group="Omarillo Commands"
    export function pen(mode: OmarilloPenMode): void {
        init();
        _omarillo.pen(mode)
    }

    /**
     * Sets the omarillo's pen color.
     */
    //% blockGap=8
    //% blockId=omarillosetpencolor block="set omarillo's pen color to %color=colorindexpicker"
    //% weight=45
    //% color.defl=1
    //% group="Omarillo Commands"
    export function setPenColor(color: number) {
        init();
        _omarillo.setPenColor(color)
    }

    /**
     * Clears the drawings created by the omarillo.
     */
    //% _blockId=omarilloClearScreen block="erase omarillo's trail"
    //% weight=44
    //% group="Omarillo Commands"
    export function clearScreen() {
        init()
        _bkg.fill(omarillo.backgroundColor);
        //home()
    }

    /**
     * Moves the omarillo to the center of the screen.
     */
    //% blockGap=8
    //% blockId=omarilloHome block="move omarillo home"
    //% weight=43
    //% group="Omarillo Commands"
    export function home(): void {
        init()
        _omarillo.home()
    }

    /**
     * Sets the omarillo's position, to the given cartesian coordinates.
     * @param x the horizontal position from -80 (left) to 80 (right), eg: 0
     * @param y the vertical position from -60 (top) to 60 (bottom), eg: 0
     */
    //% x.min=-80 x.max=80
    //% y.min=-60 y.max=60
    //% blockId=omarilloSetPositionCartesian block="set omarillo's position to (x %x, y %y)"
    //% weight=42
    //% group="Omarillo Commands"
    export function setPositionCartesian(x: number, y: number): void {
        init();
        x = x + 80
        y = 60 - y

        // to avoid screen wrapping
        if (y == 120) {
            y = 119
        }
        if (x == 160) {
            x = 159
        }

        _omarillo.setPosition(x, y)
    }

    /**
     * Stamps the image selected, at the current omarillo's position.
     * @param image 
     */
    //% _blockId=omarillostamp block="stamp %image=screen_image_picker"
    //% weight=41
    //% group="Omarillo Commands"
    export function stamp(image: Image) {
        init();      
        _omarillo.stamp(image)
    }

    /**
     * Set the omarillo's speed while moving.
     * @param speed eg: 50
     */
    //% blockGap=8
    //% blockId=omarilloSetSpeed block="set omarillo's speed %speed"
    //% speed.min=1 speed.max=100
    //% weight=40
    //% group="Omarillo Commands"
    export function setSpeed(speed: number): void {
        init();
        _omarillo.setSpeed(speed)
    }

    /**
     * Creates a omarillo object, that moves the given sprite
     */
    //% blockId=omarilloFromSprite block="a Omarillo Object with $sprite=variables_get"
    //% sprite.shadow=spritescreate
    //% blockSetVariable=myOmarillo
    //% group="Sprite Commands"
    //% weight=25
    export function fromSprite(sprite: Sprite): Omarillo {
        let omarillo: Omarillo = sprite.data[DATA_KEY];
        if (!omarillo)
            omarillo = new Omarillo(sprite, bkg())
        return omarillo;
    }
}

// got this namespace from here:  https://arcade.makecode.com/83829-00250-01775-65325 
// using it to rotate the sprites
namespace transformSprites {
    // Number of times the scaled image has been doubled.
    // Scaled image is used for sampling when rotating image.
    const NUM_SCALES: number = 1;

    // Container of state information for rotated sprites
    let _spritesWithRotations: Array<SpriteWithRotation> = [];

    /**
     * Class representing a sprite with rotation.
     */
    class SpriteWithRotation {
        private _spriteId: number;
        private _currRotation: number;
        private _origImage: Image;
        private _scaledImage: Image;

        /**
         * Initialize a sprite with rotation state.
         * @param {Sprite} sprite - The sprite to rotate.
         * @param {number} angle - Initial angle of rotation in degrees.
         */
        constructor(sprite: Sprite, angle: number = 0) {
            this._spriteId = sprite.id;
            this._currRotation = angle;
            this._origImage = sprite.image.clone();
            this._scaledImage = scale2x(sprite.image);
        }   // constructor()

        /**
         * Returns the sprite ID.
         * @return {number} The ID of the sprite.
         */
        get id(): number {
            return this._spriteId;
        }   // get id()

        /**
         * Returns the original image associated with the sprite.
         * @return {Image} Sprite's original image.
         */
        get image(): Image {
            return this._origImage;
        }   // get image()

        /**
         * Returns the current angle of rotation for the sprite.
         * @return {number} Angle of rotation in degrees.
         */
        get rotation(): number {
            return this._currRotation;
        }   // get rotation()

        /**
         * Sets the current angle of rotation for the sprite.
         * @param {number} angle - New angle of rotation in degrees.
         */
        set rotation(angle: number) {
            this._currRotation = angle;
        }   // set rotation()

        /**
         * Returns the scaled image for the sprite.
         * @return {Image} The scaled image.
         */
        get scaledImage(): Image {
            return this._scaledImage;
        }   // get scaledImage()
    }   // class SpriteWithRotation

    /**
     * Immutable class representing Cartesian coordinates.
     */
    class Coordinate {
        private _x: number;
        private _y: number;

        /**
         * Create a point.
         * @param {number} x - The x-coordinate of the point.
         * @param {number} y - The y-coordinate of the point.
         */
        constructor(x: number, y: number) {
            this._x = x;
            this._y = y;
        }   // constructor()

        /**
         * Returns the x-coordinate of the point.
         * @return {number} The x-coordinate.
         */
        public get x() {
            return this._x;
        }   // get x()

        /**
         * Returns the y-coordinate of the point.
         * @return {number} The y-coordinate.
         */
        public get y() {
            return this._y;
        }   // get y()
    }   // class Coordinate


    /**
     * Immutable class representing vectors.
     */
    class Vector {
        private _mag: number;
        private _dir: number;

        /**
         * Creates a vector.
         * @param {number} magnitude - Magnitude (length) of the vector.
         * @param {number} direction - Angle of direction of the vector.
         */
        constructor(magnitude: number, direction: number) {
            this._mag = magnitude;
            this._dir = direction;
        }   // constructor()

        /**
         * Returns the angle of direction of the vector.
         * @return {number} The vector's direction.
         */
        public get direction() {
            return this._dir;
        }   // get direction()

        /**
         * Returns the magnitude (length) of the vector.
         * @return {number} The vector's magnitude.
         */
        public get magnitude() {
            return this._mag;
        }   // get magnitude()
    }   // class Vector


    /**
     * Increment the rotation of a sprite.
     * The sprite's image will be updated with the new rotation.
     * Angle is in degrees.
     * Positive change rotates clockwise; negative change rotates counterclockwise.
     */
    // blockId=transform_change_rotation
    // block="change rotation of %sprite(mySprite) by %angleChange degrees"
    // sprite.defl=mySprite angleChange.defl=0
    export function changeRotation(sprite: Sprite, angleChange: number): void {
        if (!_spritesWithRotations[sprite.id]) {
            _spritesWithRotations[sprite.id] = new SpriteWithRotation(sprite, 0);
        }   // if ( ! _spritesWithRotations[sprite.id] )

        rotateSprite(sprite, _spritesWithRotations[sprite.id].rotation + angleChange);
    }   // changeRotation()

    /**
     * Get the current rotation angle for a sprite in degrees.
     */
    // blockId=transform_get_rotation
    // block="%sprite(mySprite) rotation"
    // sprite.defl=mySprite
    export function getRotation(sprite: Sprite): number {
        if (!_spritesWithRotations[sprite.id]) {
            return 0;
        } else {
            return _spritesWithRotations[sprite.id].rotation;
        }   // if ( ! SpriteWithRotations[sprite.id])
    }   // getRotation()

    /**
     * Rotate a sprite to a specific angle.
     * The sprite's image will be updated to the rotated image.
     * Angle is in degrees.
     * Positive change rotates clockwise; negative change rotates counterclockwise.
     */
    // blockId=transform_rotate_sprite
    // block="set rotation of %sprite(mySprite) to %angle degrees"
    // sprite.defl=mySprite angle.defl=0
    export function rotateSprite(sprite: Sprite, angle: number): void {
        if (!_spritesWithRotations[sprite.id]) {
            _spritesWithRotations[sprite.id] = new SpriteWithRotation(sprite, 0);
        }   // if ( ! _spritesWithRotations[sprite.id] )

        _spritesWithRotations[sprite.id].rotation = angle;
        sprite.setImage(rotate(_spritesWithRotations[sprite.id], angle));
    }   // rotateSprite()

    /**
     * Rotate a sprite to a specific angle.
     * @param {SpriteWithRotation} sprite - Sprite with rotation state.
     * @param {number} angle - Number of degrees to rotate sprite.
     *   Positive values rotate clockwise; negative values rotate counterclockwise.
     * @return {Image} Sprite's rotated image.
     */
    function rotate(sprite: SpriteWithRotation, angle: number): Image {
        // Normalize angle.
        angle %= 360;
        if (angle < 0) {
            angle += 360;
        }   // if (angle < 0)

        // Reflections not needing actual rotation.
        let toReturn: Image = null;
        let x: number = 0;
        let y: number = 0;
        switch (angle) {
            case 0:
                return sprite.image.clone();
            case 90:
                toReturn = image.create(sprite.image.height, sprite.image.width);
                for (x = 0; x < toReturn.width; x++) {
                    for (y = 0; y < toReturn.height; y++) {
                        toReturn.setPixel(x, y,
                            sprite.image.getPixel(y, sprite.image.width - x));
                    }   // for ( y )
                }   // for ( x )
                return toReturn;
            case 180:
                toReturn = image.create(sprite.image.height, sprite.image.width);
                for (x = 0; x < toReturn.width; x++) {
                    for (y = 0; y < toReturn.height; y++) {
                        toReturn.setPixel(x, y,
                            sprite.image.getPixel(sprite.image.width - x, sprite.image.height - y));
                    }   // for ( y )
                }   // for ( x )
                return toReturn;
            case 270:
                toReturn = image.create(sprite.image.height, sprite.image.width);
                for (x = 0; x < toReturn.width; x++) {
                    for (y = 0; y < toReturn.height; y++) {
                        toReturn.setPixel(x, y,
                            sprite.image.getPixel(sprite.image.height - y, x));
                    }   // for ( y )
                }   // for ( x )
                return toReturn;
        }   // switch (angle)


        toReturn = image.create(sprite.image.width, sprite.image.height);
        const rads: number = Math.PI * angle / 180;
        let center: Coordinate = new Coordinate(toReturn.width >> 1, toReturn.height >> 1);

        for (x = 0; x < toReturn.width; x++) {
            for (y = 0; y < toReturn.height; y++) {
                let currVector: Vector = new Vector(
                    Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2),
                    Math.atan2(y - center.y, x - center.x)
                );

                let rotVector: Vector = new Vector(
                    currVector.magnitude,
                    currVector.direction - rads
                );

                let scaledCoord: Coordinate = new Coordinate(
                    Math.round((center.x << NUM_SCALES) + (rotVector.magnitude << NUM_SCALES) * Math.cos(rotVector.direction)),
                    Math.round((center.y << NUM_SCALES) + (rotVector.magnitude << NUM_SCALES) * Math.sin(rotVector.direction))
                );

                if (scaledCoord.x >= 0 && scaledCoord.x < sprite.scaledImage.width &&
                    scaledCoord.y >= 0 && scaledCoord.y < sprite.scaledImage.height) {
                    toReturn.setPixel(x, y, sprite.scaledImage.getPixel(scaledCoord.x, scaledCoord.y));
                }   // scaledCoord within scaledImage bounds
            }   // for ( y )
        }   // for ( x )
        return toReturn;
    }   // rotateImage()


    /**
     * Smoothly doubles the size of an image.
     */
    // Implementation of Scale2X variation of Eric's Pixel Expansion (EPX) algorithm.
    // blockId=transform_scale2x
    // block="double size of|image %original=screen_image_picker"
    export function scale2x(original: Image): Image {
        // Double the size of the original.
        let toReturn: Image = image.create(original.width << 1, original.height << 1);

        for (let x: number = 0; x < original.width; x++) {
            for (let y: number = 0; y < original.height; y++) {
                // From original image:
                // .a.
                // cpb
                // .d.
                const p: color = original.getPixel(x, y);
                const a: color = original.getPixel(x, y - 1);
                const b: color = original.getPixel(x + 1, y);
                const c: color = original.getPixel(x - 1, y);
                const d: color = original.getPixel(x, y + 1);

                // In scaled image:
                // 12
                // 34
                let one: Coordinate = new Coordinate(x << 1, y << 1);
                let two: Coordinate = new Coordinate(one.x + 1, one.y);
                let three: Coordinate = new Coordinate(one.x, one.y + 1);
                let four: Coordinate = new Coordinate(one.x + 1, one.y + 1);

                // 1=P; 2=P; 3=P; 4=P;
                // IF C== A AND C!= D AND A!= B => 1 = A
                // IF A== B AND A!= C AND B!= D => 2 = B
                // IF D== C AND D!= B AND C!= A => 3 = C
                // IF B== D AND B!= A AND D!= C => 4 = D
                toReturn.setPixel(one.x, one.y, p);
                toReturn.setPixel(two.x, two.y, p);
                toReturn.setPixel(three.x, three.y, p);
                toReturn.setPixel(four.x, four.y, p);

                if (c == a && c != d && a != b) {
                    toReturn.setPixel(one.x, one.y, a);
                }   // if ( c == a ...
                if (a == b && a != c && b != d) {
                    toReturn.setPixel(two.x, two.y, b);
                }   // if ( a == b ...
                if (d == c && d != b && c != a) {
                    toReturn.setPixel(three.x, three.y, c);
                }   // if ( d == c ...
                if (b == d && b != a && d != c) {
                    toReturn.setPixel(four.x, four.y, d);
                }   // if ( b == d ...
            }   // for ( y )
        }   // for ( x )
        return toReturn;
    }   // scale2x()

    /**
     * Implementation of Scale3X derivation of EPX algorithm.
     * Smoothly triples the size of an image.
     * @param {Image} original - Image to scale.
     * @return {Image} - Image with size tripled.
     */
    export function scale3x(original: Image): Image {
        let toReturn: Image = image.create(original.width * 3, original.height * 3);

        for (let x: number = 0; x < original.width; x++) {
            for (let y: number = 0; y < original.height; y++) {
                // From original image:
                // abc
                // def
                // ghi
                const e: color = original.getPixel(x, y);
                const a: color = original.getPixel(x - 1, y - 1);
                const b: color = original.getPixel(x, y - 1);
                const c: color = original.getPixel(x + 1, y - 1);
                const d: color = original.getPixel(x - 1, y);
                const f: color = original.getPixel(x + 1, y);
                const g: color = original.getPixel(x - 1, y + 1);
                const h: color = original.getPixel(x, y + 1);
                const i: color = original.getPixel(x + 1, y + 1);

                // In scaled image:
                // 123
                // 456
                // 789
                let one: Coordinate = new Coordinate(x * 3, y * 3);
                let two: Coordinate = new Coordinate(one.x + 1, one.y);
                let three: Coordinate = new Coordinate(one.x + 2, one.y);
                let four: Coordinate = new Coordinate(one.x, one.y + 1);
                let five: Coordinate = new Coordinate(one.x + 1, one.y + 1);
                let six: Coordinate = new Coordinate(one.x + 2, one.y + 1);
                let seven: Coordinate = new Coordinate(one.x, one.y + 2);
                let eight: Coordinate = new Coordinate(one.x + 1, one.y + 2);
                let nine: Coordinate = new Coordinate(one.x + 2, one.y + 2);

                // 1=E; 2=E; 3=E; 4=E; 5=E; 6=E; 7=E; 8=E; 9=E;
                for (let newX: number = x * 3; newX < (x + 1) * 3; x++) {
                    for (let newY: number = y * 3; newY < (y + 1) * 3; y++) {
                        toReturn.setPixel(newX, newY, e);
                    }   // for ( newY )
                }   // for ( newX )
                // IF D== B AND D!= H AND B!= F => 1 = D
                // IF(D == B AND D!= H AND B!= F AND E!= C) OR (B == F AND B!= D AND F!= H AND E!= A) => 2 = B
                // IF B== F AND B!= D AND F!= H => 3 = F
                // IF(H == D AND H!= F AND D!= B AND E!= A) OR (D == B AND D!= H AND B!= F AND E!= G) => 4 = D
                // 5 = E
                // IF(B == F AND B!= D AND F!= H AND E!= I) OR (F == H AND F!= B AND H!= D AND E!= C) => 6 = F
                // IF H== D AND H!= F AND D!= B => 7 = D
                // IF(F == H AND F!= B AND H!= D AND E!= G) OR (H == D AND H!= F AND D!= B AND E!= I) => 8 = H
                // IF F== H AND F!= B AND H!= D => 9 = F
                if (d == b && d != h && b != f) {
                    toReturn.setPixel(one.x, one.y, d);
                }   // if ( d == b...
                if ((d == b && d != h && b != f && e != c) || (b != f && b != d && f != h && e != a)) {
                    toReturn.setPixel(two.x, two.y, b);
                }   // if ( (d == b...
                if (b == f && b != d && f != h) {
                    toReturn.setPixel(three.x, three.y, f);
                }   // if ( b == f...
                if ((h == d && h != f && d != b && e != a) || (d == b && d != h && b != f && e != g)) {
                    toReturn.setPixel(four.x, four.y, d);
                    toReturn.setPixel(five.x, five.y, e);
                }   // if ( (h == d...
                if ((b == f && b != d && f != h && e != i) || (f == h && f != b && h != d && e != c)) {
                    toReturn.setPixel(six.x, six.y, f);
                }   // if ( (b == f...
                if (h == d && h != f && d != b) {
                    toReturn.setPixel(seven.x, seven.y, d);
                }   // if ( h == d...
                if ((f == h && f != b && h != d && e != g) || (h == d && h != f && d != b && e != i)) {
                    toReturn.setPixel(eight.x, eight.y, h);
                }   // if ( (f == h...
                if (f == h && f != b && h != d) {
                    toReturn.setPixel(nine.x, nine.y, f);
                }   // if ( f == h...
            }   // for ( y )
        }   // for ( x )
        return toReturn;
    }   // scale3x()
}   // namespace transformSprites
