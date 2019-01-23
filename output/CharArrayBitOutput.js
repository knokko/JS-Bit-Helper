BitHelper.CharArrayBitOutput = function(array, startIndex, terminate){
    this.array = array || new Uint16Array(100);
    this.index = startIndex || 0;
	this.boolIndex = 0;
	this.currentBools = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	if(terminate){
		this.onTerminate = terminate;
	}
};

extendProtoType(BitHelper.BitOutput, BitHelper.CharArrayBitOutput);

BitHelper.CharArrayBitOutput.prototype.ensureCapacity = function(extraMargin){
    if (this.index >= this.array.length){
        const newArray = new Uint16Array(this.index + extraMargin);//add some extra space to improve performance
	    javaArrayCopy(this.array, 0, newArray, 0, this.array.length);
	    this.array = newArray;
    }
};

BitHelper.CharArrayBitOutput.prototype.terminate = function(){
	if(this.boolIndex > 0){
        this.ensureCapacity(1);
		this.array[this.index++] = BitHelper.makeChar(BitHelper.booleansToByte(this.currentBools.slice(0, 8)), BitHelper.booleansToByte(this.currentBools.slice(8, 16)));
	}
	if(this.onTerminate){
		this.onTerminate();
	}
};

BitHelper.CharArrayBitOutput.prototype.writeBoolean = function(boolean){
	if(this.boolIndex === 15){
        this.boolIndex = 0;
        this.ensureCapacity(500);
		this.currentBools[15] = boolean;
		this.array[this.index++] = BitHelper.makeChar(BitHelper.booleansToByte(this.currentBools.slice(0, 8)), BitHelper.booleansToByte(this.currentBools.slice(8, 16)));
		this.currentBools = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
	}
	else {
		this.currentBools[this.boolIndex++] = boolean;
	}
};

BitHelper.CharArrayBitOutput.prototype.writeByte = function(byte){
	const bools = BitHelper.byteToBooleans(byte);
	for(let index = 0; index < 8; index++){
		this.writeBoolean(bools[index]);//a custom writeByte method will barely improve performance anyway
	}
};