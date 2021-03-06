
//地图的每一小格
class MapItem extends eui.Group
{
	//在地图上的行
	protected row:number;
	public get Row(){ return this.row;}
	//在地图上的列
	protected col:number;
	public get Col(){return this.col;}
	//id 标记该地图片上的实物类型,用于渲染地图上的实物
	protected id:number;
	public get ID(){return this.id;}
	public constructor() 
	{
		super();
	}


}


class MapData
{
	public row: number;
	public col: number;
	public constructor(row: number, col: number)
	{
		this.row = row;
		this.col = col;
	}
}