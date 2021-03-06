// TypeScript file

/**
 * class name : Bullet
 * description : 子弹基类
 * time : 2019.1.7
 * @author : 杨浩然
 */
abstract class Bullet extends egret.DisplayObjectContainer
{
    public activeTime: number;//存活时间
    public poolName: string;//所在对象池的名字
    public index: number//在数组的下标
    public id: number;//使用这个变量知道这是谁发射的
    public damage: number;//伤害量
    public display: egret.DisplayObject;//显示对象
    public whos: WhosBullet = WhosBullet.NONE;//谁的弓箭
    public tag: WeaponType;

    public constructor()
    {
        super();
        this.index = -1;
        this.tag = WeaponType.NONE;
    }

    /** 检测碰撞 */
    public abstract  canDamage(obj: Role, startCoord?: boolean, endCoord?: boolean):boolean
    

    /** 是否碰到障碍物 */
    public abstract isHitObstacal():boolean;

    /**是否碰撞到盾*/
    //public abstract isHitShield():boolean;


    public destructor()
    {
        
    }


//class end
}