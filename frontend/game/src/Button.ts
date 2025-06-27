export class Button {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public text: string,
    public onClick: () => void,
    public hovered: boolean = false
  ) {}

  isHovered(mx: number, my: number): boolean {
    return mx >= this.x && mx <= this.x + this.width &&
           my >= this.y && my <= this.y + this.height;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.hovered ? '#888' : '#444';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
  }

  isClicked(mouseX: number, mouseY: number): boolean {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
}
