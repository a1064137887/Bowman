// TypeScript file/**玩家类 */


class Player extends Role {
	public movableX: boolean = false;
	public movableY: boolean = false;

	public arrow: eui.Image;
	public role_img: eui.Image;
	public bubble_img: eui.Image;
	public xSpeed: number = 0;
	public ySpeed: number = 0;
	public radius: number = 0;      //半径
	public range: number = 300;//射程

	//循环
	private tempX: number;
	private tempY: number;

	public friction: number = 0.1;     //摩擦力
	public frictionX: number = 0;
	public frictionY: number = 0;
	public relifeTimer: egret.Timer//复活倒计时时间控制器
	public constructor() {
		super();
		this.speed = 5;
		this.angle = 0;

	}

	protected createChildren() {
		this.skinName = "RoleSkin";
		this.radius = this.width;
		if (!this.hpTube) {
			this.hpTube = new HPTube(this, "HPTubeSkin");
		}
		this.maxHp = 70;
		this.hp = 70;
		this.hpTube.anchorOffsetX = this.hpTube.width * 0.5;
		this.hpTube.anchorOffsetY = this.hpTube.height * 0.5;
		this.anchorOffsetX = this.width * 0.5;
		this.anchorOffsetY = this.height * 0.5;
		this.hpTube.x = this.anchorOffsetX;
		this.hpTube.y = -37;
		this.addChild(this.hpTube);
		this.hpTube.showHp();
		this.hpTube.showHpLine();
		this.hpTube.visible = true;
	}
	//根据角度设置x~y轴的速率
	public moveToByAngle(angle: number): void {
		if (angle <= Math.PI) {
			this.xSpeed = Math.cos(angle) * this.speed;
			this.ySpeed = Math.sin(angle) * this.speed;
		} else if (this.angle <= Math.PI) {
			this.frictionX = Math.cos(this.angle) * this.friction;
			this.frictionY = Math.sin(this.angle) * this.friction;
			//this.xSpeed = 0;
			//this.ySpeed = 0;
		}
		this.angle = angle;
		this.role_img.rotation = angle * 180 / Math.PI + 90;
		this.arrow.rotation = this.role_img.rotation - 90;
	}
	public attack(): void {
		let bg = Main.instance.gameView.gameBg;
		let group = bg.arrowGroup;
		let arrow: Arrow = ObjectPool.instance.getObj("arrow");
		arrow.whos = WhosArrow.PLAYER;
		arrow.texture = RES.getRes("game_title_rope_png");

		let point = new egret.Point();
		this.parent.localToGlobal(this.x, this.y, point);
		let targetPoint = new egret.Point();
		group.parent.globalToLocal(point.x, point.y, targetPoint);
		// group.addChild(arrow);
		arrow.index = bg.addArrow(arrow, 0);
		arrow.x = targetPoint.x;
		arrow.y = targetPoint.y;
		arrow.rotation = this.arrow.rotation + 90;
		arrow.moveFrom(targetPoint.x, targetPoint.y, (arrow.rotation - 90) * Math.PI / 180, this.range);
	}
	public move(xAxis, yAxis, angle, offset): void {
		//获得速度
		// if(this.angle > Math.PI) {
		//     if(this.xSpeed == 0) {

		//     }else if(Math.abs(this.xSpeed) <= Math.abs(this.frictionX)) {
		//         this.xSpeed = 0;
		//     } else {
		//         this.xSpeed -= this.frictionX;
		//     }
		//     if(this.ySpeed == 0) {

		//     }else if(Math.abs(this.ySpeed) <= Math.abs(this.frictionY)) {
		//         this.ySpeed = 0;
		//     } else{
		//         this.ySpeed -= this.frictionY;
		//     }
		// }

		this.tempX = this.x + xAxis * this.speed;
		this.tempY = this.y + (-yAxis * this.speed);

		// console.log(this.xSpeed);
		// console.log(this.ySpeed);
		//左右碰边判断
		// if(this.tempX-this.radius > 0 && this.tempX+this.radius < this.mapWidth) {
		this.x = this.tempX;
		// } else {
		//     if(this.tempX-this.radius < 0 && this.xSpeed>0)
		//     {
		//         this.x = this.tempX;
		//     }
		//     else if(this.tempX+this.radius > this.mapWidth && this.xSpeed<0)
		//     {
		//         this.x = this.tempX;
		//     }
		//     else
		//     {
		//         this.xSpeed = 0;
		//     }
		// }

		//上下碰边判断
		// if(this.tempY-this.radius > 0 && this.tempY+this.radius < this.mapHeight) {
		this.y = this.tempY;
		// } else {
		//     if(this.tempY-this.radius < 0 && this.ySpeed>0)
		//     {
		//         this.y = this.tempY;
		//     }
		//     else if(this.tempY+this.radius > this.mapHeight && this.ySpeed<0)
		//     {
		//         this.y = this.tempY;
		//     }
		//     else
		//     {
		//         this.ySpeed = 0;
		//     }
		// }
		this.verifyLimit();
	}

	/** 点击技能时增加的属性值 */
	public addSkillProperty(skill: SkillComponent) {

	}

	private verifyLimit() {
		if (StageUtils.WIN_WIDTH / 2 - this.speed <= this.x && this.x <= StageUtils.WIN_WIDTH / 2 + this.speed)
			this.movableX = false;
		if (StageUtils.WIN_HEIGHT / 2 - this.speed <= this.y && this.y <= StageUtils.WIN_HEIGHT / 2 + this.speed)
			this.movableY = false;
	}

	////扣血类型，0是玩家，1是敌人
	public doDamage(damage: number) {
		super.doDamage(damage);
		if (this.hp == 0) {
			Main.instance.gameView.addMsg("'你被别人干死了");
			let reliveHint: string = Util.getWordBySign('reliveHint');
			let reliveWord: string = Util.getWordBySign('reliveWord');
			let freeRelive: string = Util.getWordBySign('freeRelive');
			let pop: PopWindow = Main.instance.crePop(reliveHint, function () { }, function () { }, reliveWord, freeRelive);

			// let lifeCount: number = 9
			// let lifeNum: egret.Bitmap = new egret.Bitmap(RES.getRes('red_num' + lifeCount))
			// lifeNum.x = (0.75 * StageUtils.WIN_WIDTH - lifeNum.width) *0.5;
			// lifeNum.y = StageUtils.WIN_WIDTH * 0.58
			// pop.addChild(lifeNum)

			// //倒计时
			// this.relifeTimer = new egret.Timer(1000, 10)
			// this.relifeTimer.addEventListener(egret.TimerEvent.TIMER, () => {
			// 	lifeCount--
			// 	lifeNum.texture = RES.getRes('red_num' + lifeCount)
			// }, this)
			// this.relifeTimer.once(egret.TimerEvent.TIMER_COMPLETE, () => {
			
			// }, this)
			// this.relifeTimer.start()
			this.destroy();
		}
	}
}

window["Player"] = Player;