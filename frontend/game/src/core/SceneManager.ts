import { Engine, Scene, ArcRotateCamera, HemisphericLight, Color4, Vector3 } from '@babylonjs/core';

export interface SceneConfig {
  clearColor?: Color4;
  cameraPosition?: Vector3;
  cameraTarget?: Vector3;
  lightIntensity?: number;
  lightDirection?: Vector3;
}

export class SceneManager {
  private engine: Engine;
  private scene: Scene;
  private camera: ArcRotateCamera;
  private light: HemisphericLight;
  private canvas: HTMLCanvasElement;
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement, config: SceneConfig = {}) {
    this.canvas = canvas;
    this.engine = new Engine(canvas, true);
    this.scene = new Scene(this.engine);
    
    this.setupScene(config);
    this.setupCamera(config);
    this.setupLighting(config);
    this.setupResizeHandler();
    this.startRenderLoop();
  }

  private setupScene(config: SceneConfig): void {
    this.scene.clearColor = config.clearColor || new Color4(0, 0, 0, 0);
  }

  private setupCamera(config: SceneConfig): void {
    const target = config.cameraTarget || Vector3.Zero();
    this.camera = new ArcRotateCamera(
      "camera", 
      -Math.PI / 2, 
      Math.PI / 2.5, 
      10, 
      target, 
      this.scene
    );
    
    if (config.cameraPosition) {
      this.camera.position = config.cameraPosition;
    }
    
    this.camera.attachControl(this.canvas, false);
  }

  private setupLighting(config: SceneConfig): void {
    const lightDirection = config.lightDirection || new Vector3(0, 1, 0);
    this.light = new HemisphericLight("light", lightDirection, this.scene);
    this.light.intensity = config.lightIntensity || 0.7;
  }

  private setupResizeHandler(): void {
    this.resizeHandler = () => {
      this.engine.resize();
    };
    window.addEventListener("resize", this.resizeHandler);
  }

  private startRenderLoop(): void {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  public getScene(): Scene {
    return this.scene;
  }

  public getEngine(): Engine {
    return this.engine;
  }

  public getCamera(): ArcRotateCamera {
    return this.camera;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public dispose(): void {
    window.removeEventListener("resize", this.resizeHandler);
    this.scene.dispose();
    this.engine.dispose();
  }
}