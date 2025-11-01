var gridElements = [
	['blank','Ground','The area where the character can move freely.'] //0
	,['character','Character','The character the player controls.'] //1
	,['wall','Wall','An item to restrict character movement.'] //2
	,['rock','Block','A pushable item only blocked by a wall or another block.'] //3
	,['dirt','Fragile Block','A breakable block.'] //4
	,['exit','Level Exit','The point where the character must reach to finish the level.'] //5

	,['key-red','Red Key','Red Key(s) required to be collected to open a Red Gate.'] //6
	,['key-red rock','Hidden Red Key','Red Key hidden under a block.'] //7
	,['gate-red','Red Gate','A block that restricts character movement. Opened by collecting all Red Key(s).'] //8

	,['key-blue','Blue Key','Blue Key(s) required to be collected to open a Blue Gate.'] //9
	,['key-blue rock','Hidden Blue Key','Blue Key hidden under a block'] //10
	,['gate-blue','Blue Gate','A block that restricts character movement. Opened by collecting all Blue Key(s).'] //11

	,['key-brown','Brown Key','Brown Key(s) required to be collected to open a Brown Gate.'] //12
	,['key-brown rock','Hidden Brown Key','Brown Key hidden under a block.'] //13
	,['gate-brown','Brown Gate','A block that restricts character movement. Opened by collecting all Brown Key(s).'] //14

	,['key-green','Green Key','Green Key(s) required to be collected to open a Green Gate.'] //15
	,['key-green rock','Hidden Green Key','Green Key hidden under a block.'] //16
	,['gate-green','Green Gate','A block that restricts character movement. Opened by collecting all Green Key(s).'] //17

	//warp plates
	,['warp-plate-red','Warp Red','A portal to warp another Red portal.'] //18
	,['warp-plate-red rock','Hidden Warp Red','Warp Red hidden under a block.'] //19
	,['warp-plate-blue','Warp Blue','A portal to warp to another Blue portal.'] //20
	,['warp-plate-blue rock','Hidden Warp Blue','Warp Blue hidden under a block.'] //21
	,['warp-plate-brown','Warp Brown','A portal to warp to another Brown portal.'] //22
	,['warp-plate-brown rock','Hidden Warp Brown','Warp Brown hidden under a block.'] //23
	,['warp-plate-green','Warp Green','A portal to warp to another Green portal.'] //24
	,['warp-plate-green rock','Hidden Warp Green','Warp Green hidden under a block.'] //25

	//weight plates
	,['weight-plate','Weight Plate','A weight sensitive plate. Requires the weight of a block to activate.'] //26
	,['weight-plate-gate','Weight Plate Gate','An gate only removed once all Weight Plates are activated.'] //27

	//bombs
	,['detonator','Detonator','Used to detonate all bombs.'] //28
	,['bomb','Bomb','A bomb that can be detonated.'] //29

	//hole
	,['fragile-ground','Fragile Ground','An area that can only be used once before becoming a hole.'] //30
	,['hole','Hole','What goes in does not come out.'] //31

	//coins
	,['coin','Coin','Coins(s) required to be collected to reveal a Coin Exit.'] //32
	,['coin rock','Hidden Coin','Coin hidden under a block.'] //33
	,['coin-exit','Coin Level Exit','An invisible Exit only revealed once all coins are collected.'] //34
];