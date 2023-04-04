// created by wan-developer 

window.onload = ()=>{
const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

var delta;
var gameLoop;

const projetiles = [];

const enemies = [];

const particles = [];

const maxEnemy = 10;

var enemyTimer = 0;

var enemyInterval = 50;


//Player Class was Here
class Player {
  
  constructor( x, y, radius, velocity, move) {

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.velocity = velocity;
    this.speed = 0.4;
    this.color = "#fff";
    this.move = move;
  }
  draw() {
    ctx.beginPath();
    
    ctx.fillStyle = this.color;
  
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }
  
  update(delta) {
    if(this.move){
      this.x += this.velocity.x * this.speed * delta;
      this.y += this.velocity.y * this.speed * delta;
    }
    
  }
}

class Projetile extends Player{
  constructor(x,y,radius,velocity,move) {
    super(x,y,radius,velocity,move)
    
  }
  
}

class Enemy extends Player {
  
  constructor(x,y,radius,velocity,move) {
    super(x,y,radius,velocity,move,player)
    
    this.color = `hsl(${Math.random() * 350},60%,50%)`
    this.move = true;
    this.speed = (Math.random() * 0.1) + this.radius / 500;
    this.pushForce = 20;
    this.angle = 0;

    this.shakeMode = true;
  }
  
  update(delta) {
    //shake
    if( this.shakeMode ) {
        this.x += Math.random() < 0.5 ? -1 : 1;
        this.y += Math.random() < 0.5 ? -1 : 1;
    }
    
    //move to player
    this.x += this.velocity.x * this.speed * delta;
    this.y += this.velocity.y * this.speed * delta;
    
    //makes the enemy goes to the center
    this.angle = Math.atan2(
    canvas.height/2 - this.y , canvas.width/2-this.x)
    
    
    this.velocity = {
         x: Math.cos(this.angle),
         y: Math.sin(this.angle) 
    };
    
    
    
    
    
  }
  push(velocity) {
      this.x += velocity.x * this.pushForce;
      this.y += velocity.y * this.pushForce;
  }
  
}

class Particles {
  
  constructor(x,y,color,velocity,expand){
    this.x = x;
    this.y = y;
    this.alpha = 1;
    this.radius = Math.random() * (4 - 6) + 4;
    this.velocity = velocity;
    this.color = `hsl(${Math.random()*60},${50}%,${Math.random() * 20}%)`;
    
    this.speed = 0.3;
    this.scale = 1;
    
    this.expand = expand; // bollean
    
  }
  
  update(delta) {
    if(!this.expand) this.radius = Math.random()*20;
    else this.radius,this.speed = Math.random()*10;
    
    
    if(!this.expand) {
        this.x += (Math.random() < 0.5 ? -1 : 1) * this.speed * delta;
        
        this.y += (Math.random() < 0.5 ? -1 : 1) * this.speed * delta;
        
    }else{
        this.x += -this.velocity.x * 
        (Math.random() < 0.5 ? -1 : 1) * this.speed * delta;
        this.y += -this.velocity.y * 
        (Math.random() < 0.5 ? -1 : 1) * this.speed * delta;
    }
    
    
    this.alpha -= 0.02;
   
  }
  
  draw() {
    ctx.save()
    ctx.beginPath();
    ctx.globalCompositeOperation = "screen";
    
    ctx.scale = this.scale+"px"
    
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
    
    ctx.fill();
    
    ctx.restore();
    
  }
  
  
  
}

let player = new Player(canvas.width/2,canvas.height/2,20,false);



function createParticles(x,y,color,
                        velocity,num,expand) {
  
  
  
  for(let i=0;i<num;i++) {
    
    
    
    particles.push(new Particles(x,y,color,velocity,expand))
    
    
  }


}


canvas.addEventListener("touchstart", touchHandler);
canvas.addEventListener("click", touchHandler);


function touchHandler( e ) {
  //04/03/2023 - Now it works for touches and clicks
  e.preventDefault();
  
  let touchX;
  let touchY;
  
  const isClick = e.touches === undefined;

  if(isClick)
  {
    touchX = Math.floor(e.clientX);
    touchY = Math.floor(e.clientY);

  }else{
    touchX = Math.floor(e.touches[0].clientX);
    touchY = Math.floor(e.touches[0].clientY);
  }    


  if(touchX === undefined) console.log("hello")
  
  const angle = Math.atan2(touchY - canvas.height/2,
                           touchX - canvas.width/2);
                           
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle)
  }
  
  projetiles.push(new Projetile(canvas.width/2,
                                canvas.height/2,
                                5,
                                velocity,true));
  
  
}

var timeStamp = 0;

function animate() {
    ctx.fillStyle = "rgb(0,0,0,0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //calculating deltaTime
    const timePassed = (Date.now() - timeStamp);
    
    timeStamp = Date.now();
    
    const deltaTime = ( 1 / timePassed /1000)
    
    ctx.fillStyle = "#fff"
    ctx.fillText(timePassed,100,200)
    
   
  //ctx.fillText(timeStamp,200,200)
  //CREATE ENEMIES
  if (enemies.length < maxEnemy) {
      
      
      let radius = Math.random() * (30 - 10) + 10
      
      let randomizer = Math.random() < 0.5 ? 1 : -1;
      
      let x = undefined;
      
      let y = undefined;
      
      //console.log(randomizer)
      
      if(randomizer === -1 ) {
          x = Math.random() * canvas.width +
          canvas.width;
      
          y = Math.random() * canvas.height;
          
      }
      else if (randomizer == 1){
          x = 0;
      
          y = Math.random() * canvas.height;
          
      }
      
      if(enemyTimer > enemyInterval) {
          
          enemies.push(new Enemy(
              x,
              y,
              radius,
          {x:1,y:1},false,player
  
          ))
          enemyTimer = 0;
          
      }else{
          enemyTimer++;
      }
  
  }
    
  player.draw();
  //looping throgh projetiles to check collision
  projetiles.forEach((projetile,projIndex)=>{
    
    //checks if proj is off screen to remove
    if(projetile.x > canvas.width ||
      projetile.x < 0 ||
      projetile.y > canvas.height ||
      projetile.y < 0) {
        
          projetiles.splice(projIndex,1);
        
       }
    //calculate collision bullet with enemy
    enemies.forEach((enemy,enemyIndex)=>{
      
      let dis = Math.hypot(enemy.x - projetile.x,
                           enemy.y - projetile.y);
      
      
      //for particles
      let angle = Math.atan2(canvas.height/2 - enemy.y,
                             canvas.width/2 - enemy.x);
      
      let velocity = {
        x: Math.random() * Math.cos(angle),
        y: Math.random() * Math.sin(angle)
      }
      
                          
      if(dis - enemy.radius - projetile.radius < 2){
        if(enemy.radius > 15 && enemy.radius > 8) {
          //MAKES THE ENEMY SMALLER
          enemy.radius -= 4;
          
          //PUSH THE ENEMY WHITH BULLET
          enemy.push({
              x: -velocity.x,
              y: -velocity.y
              
          });
         
          //create Big particle
           createParticles(
               enemy.x,enemy.y,
               enemy.color,{
                   x: Math.cos(angle),
                   y: Math.sin(angle)
               },20,true);
          
          
        }else{
          //remove the enemy
          enemies.splice(enemyIndex,1);
         //create small particles
          createParticles(
          enemy.x,enemy.y,
          enemy.color,velocity,20,false);
          
        }
        projetiles.splice(projIndex,1);
        
      }
      
    })
    
      projetile.draw();
      projetile.update(timePassed);
      
  
  })
  
  particles.forEach((particle,index)=>{
      
      particle.draw()
      particle.update(timePassed)
      
      if(particle.alpha <= 0) {
        particles.splice(index,1)
    
      }
       
    })
      
  
  //remove enemies
  enemies.forEach((enemy,index)=>{
    
    let playerDis = Math.hypot(player.x - enemy.x,
                               player.y - enemy.y);
                               
    if(playerDis - player.radius - enemy.radius < 2){
        
        //console.log(1)
        //stopAnimation()
        enemies.splice(index,1)
        
        
    }
    
    enemy.draw();
    enemy.update(timePassed);
    
    
  })
  
  ctx.fillText(enemies.length,100,100)
  
  gameLoop = requestAnimationFrame(animate);
  
}

//let myReq = requestAnimationFrame(animate);
function stopAnimation() {
    
    window.cancelAnimationFrame(gameLoop)
    
}

window.addEventListener("resize", ()=>{
    //Fixing the resize bug (4/3/2023)
    player.x = window.innerWidth / 2;
    player.y = window.innerHeight / 2;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //
})

animate()


}//onload

