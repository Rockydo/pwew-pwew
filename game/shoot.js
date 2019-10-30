var bulletTime1 = 0;

var bullet_player1_material = new THREE.MeshLambertMaterial(
{
    color: 0x00ff00, 
    transparent: false
});

function shoot()
{
    if (keyboard.pressed("space") && bulletTime1 + 0.4 < clock.getElapsedTime())
    {
        bullet = new THREE.Mesh(
            new THREE.SphereGeometry(2),
            bullet_player1_material);
        scene.add(bullet);
        bullet.position.x = player1.graphic.position.x + 7.5 * Math.cos(player1.direction);
        bullet.position.y = player1.graphic.position.y + 7.5 * Math.sin(player1.direction);
        bullet.angle = player1.direction;
        player1.bullets.push(bullet);
        bulletTime1 = clock.getElapsedTime();
    } 

    // move bullets
    var moveDistance = 5;

    for (var i = 0; i < player1.bullets.length; i++)
    {
        player1.bullets[i].position.x += moveDistance * Math.cos(player1.bullets[i].angle);
        player1.bullets[i].position.y += moveDistance * Math.sin(player1.bullets[i].angle);
    }

}

function collisions()
{
    bullet_wall_collision();
    bullet_enemy_collision();
    player_collision();
    player_falling();
    player_enemy_collision();
}

function bullet_wall_collision()
{
    //collision between bullet and walls
    for (var i = 0; i < player1.bullets.length; i++)
    {
        if (Math.abs(player1.bullets[i].position.x) >= WIDTH / 2 ||
            Math.abs(player1.bullets[i].position.y) >= HEIGHT / 2)
        {
            scene.remove(player1.bullets[i]);
            player1.bullets.splice(i, 1);
            i--;
        }
    }

}

function bullet_enemy_collision()
{
    //collision between bullet and enemies
    for (var i = 0; i < player1.bullets.length; i++)
    {
        for (var j = 0; j < enemies.length; j++){
            if (enemies[j] !== undefined && Math.abs(player1.bullets[i].graphic.position.x - enemies[j].graphic.position.x) < 8
                && Math.abs(player1.bullets[i].graphic.position.y - enemies[j].graphic.position.y) < 8)
            {
                console.log("HIT");
                scene.remove(enemies[j].graphic);
                scene.remove(player1.bullets[i]);
                enemies.splice(j, 1);
                player1.bullets.splice(i, 1);
                i--;
                j--;           
            }
        }
        
    }

}
function player_enemy_collision()
{
    //collision between the player and enemies
    
        for (var j = 0; j < enemies.length; j++){
            if (Math.abs(player1.graphic.position.x - enemies[j].graphic.position.x) < 20
                && Math.abs(player1.graphic.position.y - enemies[j].graphic.position.y) < 20)
            {
                if (bulletTime1 + 2 <  clock.getElapsedTime()){
                    console.log("LOST 1 LIFE");
                    player1.life--;
                    if (player1.life == 0)
                        player1.dead();
                    bulletTime1 = clock.getElapsedTime();
                }

            }
        }
        

}

function player_collision()
{
    //collision between player and walls
    var x = player1.graphic.position.x + WIDTH / 2;
    var y = player1.graphic.position.y + HEIGHT / 2;

    if ( x < 0 )
        player1.graphic.position.x -= x;
    if ( x > WIDTH )
        player1.graphic.position.x -= x - WIDTH;
    if ( y < 0 )
        player1.graphic.position.y -= y;
    if ( y > HEIGHT )
        player1.graphic.position.y -= y - HEIGHT;
    
    for (var j = 0; j < enemies.length; j++){
        var x = enemies[j].graphic.position.x + WIDTH / 2;
        var y = enemies[j].graphic.position.y + HEIGHT / 2;
        if ( x < 0 )
            enemies[j].graphic.position.x -= x;
        if ( x > WIDTH )
            enemies[j].graphic.position.x -= x - WIDTH;
        if ( y < 0 )
            enemies[j].graphic.position.y -= y;
        if ( y > HEIGHT )
            enemies[j].graphic.position.y -= y - HEIGHT; 
    }

}

function player_falling()
{
    var nb_tile = 10;
    var sizeOfTileX = WIDTH / nb_tile;
    var sizeOfTileY = HEIGHT / nb_tile;
    var x = player1.graphic.position.x | 0;
    var y = player1.graphic.position.y | 0;
    var length = noGround.length;
    var element = null;

    for (var i = 0; i < length; i++) {
        element = noGround[i];

        var tileX = (element[0]) | 0;
        var tileY = (element[1]) | 0;
        var mtileX = (element[0] + sizeOfTileX) | 0;
        var mtileY = (element[1] + sizeOfTileY) | 0;

        if ((x > tileX)
            && (x < mtileX)
            && (y > tileY) 
            && (y < mtileY))
        {
            player1.life--;
            if (player1.life == 0){
                console.log("LOST 1 LIFE"); 
                player1.dead();
            }
        }
    }

}
