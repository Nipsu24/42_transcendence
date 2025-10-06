import { Scene, MeshBuilder, Vector3, Color3, StandardMaterial, PBRMaterial, RectAreaLight, ArcRotateCamera, HemisphericLight } from '@babylonjs/core';

export interface PongGameObjects {
  paddle1: any;
  paddle2: any;
  ball: any;
  ground: any;
  lights: RectAreaLight[];
}

export interface TrailEffect {
  colors: Color3[];
  index: number;
}

export class PongGraphics {
  private scene: Scene;
  private trailColors: Color3[];

  constructor(scene: Scene) {
    this.scene = scene;
    this.trailColors = [
      Color3.FromHexString("#FEF018"),
      Color3.FromHexString("#FE8915"),
      Color3.FromHexString("#FF4F1A"),
      Color3.FromHexString("#55CFD4"),
      Color3.FromHexString("#26B2C5"),
      Color3.FromHexString("#0489C2"),
    ];
  }

  public createPaddle(name: string, width: number, height: number, depth: number = 2): any {
    const paddle = MeshBuilder.CreateBox(name, {
      width: width,
      height: height,
      depth: depth
    }, this.scene);

    const paddleMat = new StandardMaterial(`${name}Mat`, this.scene);
    paddleMat.diffuseColor = Color3.White();
    paddleMat.emissiveColor = new Color3(0.2, 0.2, 0.2);
    paddle.material = paddleMat;

    return paddle;
  }

  public createBall(diameter: number): any {
    const ball = MeshBuilder.CreateSphere("ball", { diameter }, this.scene);
    
    const ballMat = new StandardMaterial("ballMat", this.scene);
    ballMat.diffuseColor = Color3.Yellow();
    ballMat.emissiveColor = new Color3(0.2, 0.2, 0);
    ball.material = ballMat;

    return ball;
  }

  public createGround(width: number, height: number, depth: number = 0.5): any {
    const ground = MeshBuilder.CreateBox("ground", {
      width: width,
      height: height, 
      depth: depth
    }, this.scene);

    const groundMat = new PBRMaterial("groundMat", this.scene);
    groundMat.baseColor = new Color3(0.1, 0.1, 0.1);
    groundMat.metallic = 0.1;
    groundMat.roughness = 0.8;
    ground.material = groundMat;

    return ground;
  }

  public createLights(): RectAreaLight[] {
    const lights: RectAreaLight[] = [];
    
    const lightPositions = [
      { x: -200, y: 150, z: 50 },
      { x: 200, y: 150, z: 50 },
      { x: -200, y: -150, z: 50 },
      { x: 200, y: -150, z: 50 }
    ];

    lightPositions.forEach((pos, index) => {
      const light = new RectAreaLight(`light${index}`, this.scene);
      light.position.x = pos.x;
      light.position.y = pos.y;
      light.position.z = pos.z;
      light.width = 20;
      light.height = 20;
      light.intensity = 10;
      light.diffuse = this.trailColors[index % this.trailColors.length];
      lights.push(light);
    });

    return lights;
  }

  public createTrailParticle(
    ballX: number, 
    ballY: number, 
    ballSize: number, 
    trailIndex: number
  ): void {
    const trail = MeshBuilder.CreateSphere("trail" + trailIndex, { 
      diameter: ballSize 
    }, this.scene);
    
    const trailPos = new Vector3(ballX, ballY, 10);
    trail.position = trailPos;

    const trailMat = new StandardMaterial("trailMat" + trailIndex, this.scene);
    trailMat.emissiveColor = this.trailColors[trailIndex % this.trailColors.length];
    trailMat.alpha = 0.8;
    trailMat.disableLighting = true;
    trail.material = trailMat;

    this.animateTrailFade(trail, trailMat);
  }

  private animateTrailFade(trail: any, material: StandardMaterial): void {
    let life = 1.0;
    const fadeSpeed = 0.04;
    
    const fadeAnimation = () => {
      if (!trail.isDisposed()) {
        life -= fadeSpeed;
        material.alpha = life * 0.8;
        
        const scale = life * 0.9 + 0.1;
        trail.scaling = new Vector3(scale, scale, scale);
        
        if (life <= 0) {
          trail.dispose();
          return;
        }
        requestAnimationFrame(fadeAnimation);
      }
    };
    requestAnimationFrame(fadeAnimation);
  }

  public animateLights(lights: RectAreaLight[], frameCount: number): void {
    const colorIndex = Math.floor(frameCount / 10) % this.trailColors.length;
    
    lights.forEach((light, index) => {
      const currentColorIndex = (colorIndex + index) % this.trailColors.length;
      light.diffuse = this.trailColors[currentColorIndex];
    });
  }

  public setupSceneAndCamera(playArea: any, canvasEl: HTMLCanvasElement): ArcRotateCamera {
    // Clear existing scene objects
    this.scene.meshes.forEach(m => m.dispose());
    this.scene.lights.forEach(l => l.dispose());
    this.scene.cameras.forEach(c => c.dispose());

    // Setup camera
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2 + 0.05,
      Math.max(playArea.width, playArea.height) * 0.8,
      new Vector3(playArea.width/2, playArea.y + playArea.height/2 - 10, 0),
      this.scene
    );

    camera.setTarget(new Vector3(playArea.width/2, playArea.y + playArea.height/2 - 10, 0));
    camera.detachControl();
    this.scene.activeCamera = camera;
    
    // Disable pointer interactions
    if (canvasEl) {
      canvasEl.onpointerdown = null;
      canvasEl.onpointermove = null;
      canvasEl.onpointerup = null;
      canvasEl.onwheel = null;
    }

    // Add basic ambient lighting
    const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), this.scene);
    ambientLight.intensity = 0.8;
    this.scene.ambientColor = new Color3(1, 1, 1);

    return camera;
  }

  public setupPongGameObjects(playArea: any, getBallSize: () => number, getPaddleWidth: () => number, getPaddleHeight: () => number): PongGameObjects {
    // Create game objects using PongGraphics
    const paddleWidth = Math.max(getPaddleWidth(), 15);
    const paddleHeight = Math.max(getPaddleHeight(), 80);
    const ballSize = Math.max(playArea.width * 0.015, 20);

    const paddle1 = this.createPaddle("paddle1", paddleWidth, paddleHeight, 8);
    paddle1.position.x = paddleWidth / 2;
    paddle1.position.y = playArea.y + (playArea.height / 2);

    const paddle2 = this.createPaddle("paddle2", paddleWidth, paddleHeight, 8);
    paddle2.position.x = playArea.width - (paddleWidth / 2);
    paddle2.position.y = playArea.y + (playArea.height / 2);

    const ball = this.createBall(ballSize);

    // Create ground
    const ground = this.createGround(playArea.width * 2, playArea.height * 2, 0.5);
    ground.position.y = playArea.y - getBallSize() * 0.5;
    ground.position.x = playArea.width / 2;
    ground.position.z = 0;

    // Create lights
    const lights = this.createLights();

    return {
      paddle1,
      paddle2,
      ball,
      ground,
      lights
    };
  }

  public getTrailColors(): Color3[] {
    return this.trailColors;
  }

  public dispose(): void {
    // Cleanup any resources if needed
  }
}