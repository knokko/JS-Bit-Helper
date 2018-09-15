BitHelper.StringBitOutput = function(terminate){
	this.string = '';
	this.boolIndex = 0;
	this.currentBools = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	if(terminate){
		this.onTerminate = terminate;
	}
};

extendProtoType(BitHelper.BitOutput, BitHelper.StringBitOutput);

BitHelper.StringBitOutput.prototype.terminate = function(){
	if(this.boolIndex > 0){
		this.string += String.fromCharCode(BitHelper.makeChar(BitHelper.booleansToByte(this.currentBools.slice(0, 8)), BitHelper.booleansToByte(this.currentBools.slice(8, 16))));
	}
	if(this.onTerminate){
		this.onTerminate();
	}
};

BitHelper.StringBitOutput.prototype.writeBoolean = function(boolean){
	if(this.boolIndex === 15){
		this.boolIndex = 0;
		this.currentBools[15] = boolean;
		this.string += String.fromCharCode(BitHelper.makeChar(BitHelper.booleansToByte(this.currentBools.slice(0, 8)), BitHelper.booleansToByte(this.currentBools.slice(8, 16))));
		this.currentBools = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	}
	else {
		this.currentBools[this.boolIndex++] = boolean;
	}
};

BitHelper.StringBitOutput.prototype.writeByte = function(byte){
	const bools = BitHelper.byteToBooleans(byte);
	for(let index = 0; index < 8; index++){
		this.writeBoolean(bools[index]);//a custom writeByte method will barely improve performance anyway
	}
};