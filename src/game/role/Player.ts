// TypeScript file/**玩家类 */


class Player extends Role {
	public movableX: boolean = false;
	public movableY: boolean = false;


	public xSpeed: number = 0;
	public ySpeed: number = 0;
	public radius: number = 0;      //半径

	//循环
	private tempX: number;
	private tempY: number;

	public friction: number = 0.1;//摩擦力
	public frictionX: number = 0;
	public frictionY: number = 0;
	public constructor() {
		super();
		this.id = 0;
		this.weapon = new Shotgun(this);
		this.nickName = "我的名字"
	}

	protected createChildren() {
		this.skinName = "RoleSkin";
		this.radius = this.width;
		if (!this.hpTube) {
			this.hpTube = new HPTube(this, "HPTubeSkin");
		}

		this.hpTube.anchorOffsetX = this.hpTube.width * 0.5;
		this.hpTube.anchorOffsetY = this.hpTube.height * 0.5;
		this.anchorOffsetX = this.width * 0.5;
		this.anchorOffsetY = this.height * 0.5;

		this.hpTube.x = this.anchorOffsetX;
		this.hpTube.y = -37;
		this.addChild(this.hpTube);
		this.hpTube.showHp();
		//this.hpTube.showHpLine();
		this.hpTube.visible = true;

		//初始化等级和基础配置
		this.initPlayer();
	}

	public initPlayer()
	{
		this.attribute.level = 1;
		this.setBaseAttOfLevel();
	}

	//根据角度设置x~y轴的速率
	public moveToByAngle(angle: number): void {
		if (angle <= Math.PI) {

			this.xSpeed = Math.cos(angle) * this.getSpeed();
			this.ySpeed = Math.sin(angle) * this.getSpeed();
		} else if (this.attribute.angle <= Math.PI) {
			this.frictionX = Math.cos(this.attribute.angle) * this.friction;
			this.frictionY = Math.sin(this.attribute.angle) * this.friction;
			//this.xSpeed = 0;
			//this.ySpeed = 0;
		}

		this.attribute.angle = angle;
		this.role_img.rotation = angle * 180 / Math.PI + 90;
		this.arrow.rotation = this.role_img.rotation - 90;
	}

	public attack(): void {
		this.weapon.attack(0);
	}

	public move(xAxis, yAxis, angle, offset): void {
		this.tempX = this.x + xAxis * this.getSpeed();
		this.tempY = this.y + (-yAxis * this.getSpeed());
		this.x = this.tempX;
		this.y = this.tempY;
		this.verifyLimit();
	}

	private verifyLimit() {

		if (StageUtils.WIN_WIDTH / 2 - this.attribute.speed <= this.x && this.x <= StageUtils.WIN_WIDTH / 2 + this.attribute.speed)
			this.movableX = false;
	
		if (StageUtils.WIN_HEIGHT / 2 - this.attribute.speed <= this.y && this.y <= StageUtils.WIN_HEIGHT / 2 + this.attribute.speed)
			this.movableY = false;
	}

	public doDamage(damage: number) {
		super.doDamage(damage);
		if (this.attribute.hp == 0) {
			Main.instance.gameView.showGameEndReLife();
		}
	}
	
	public levelUp() {
		super.levelUp();
		this.attribute.level = this.attribute.level < UserData.levelMax ? this.attribute.level : UserData.levelMax;
		this.setBaseAttOfLevel();
		Main.instance.gameView.showSkills();
	}

	//根据角色等级设置基础属性
	public setBaseAttOfLevel()
	{	
		let index = this.attribute.level;
		let playerConfig = GameConfig.playerConfig["player"][index.toString()];
		if(playerConfig)
		{
			this.attribute.exp = 0;
			this.attribute.expMax = playerConfig.experience;
			this.attribute.speed = playerConfig.speed;
			this.attribute.power = playerConfig.power;
			let lastHpMax = this.attribute.hpMax;
			this.attribute.hpMax = playerConfig.hp;

			//设置当前血量
			let resumeValue = this.attribute.hpMax - lastHpMax;
			this.resumeBlood(resumeValue,true);
		}
		else
		{
			console.log("setBaseAttOfLevel error");
		}
	}

	public addExp(expValue: number)
	{
		super.addExp(expValue);
		Main.instance.gameView.showPlayerLvExp();
	}

	public reLife()
	{
		this.attribute.hp = this.attribute.hpMax * 0.5;
		this.hpTube.showHp();
		this.die = false;
	}
}

window["Player"] = Player;