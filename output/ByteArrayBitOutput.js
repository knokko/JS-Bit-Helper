BitHelper.ByteArrayBitOutput = function(array, startIndex, terminate){
	this.array = array ? array : new Int8Array(100);
	this.index = startIndex ? startIndex : 0;
	this.boolIndex = 0;
	if(terminate){
		this.terminate = terminate;
	}
};

extendProtoType(BitHelper.BitOutput, BitHelper.ByteArrayBitOutput);

BitHelper.ByteArrayBitOutput.prototype.terminate = function(){};

BitHelper.ByteArrayBitOutput.prototype.writeBoolean = function(boolean){
	if (this.index >= this.array.length){
		this.increaseCapacity();
	}
	if(this.boolIndex === 7){
		this.boolIndex = 0;
		const old = BitHelper.byteToBooleans(this.array[this.index]);
		old[7] = boolean;
		this.internalAddByte(BitHelper.booleansToByte(old));
		return;
	}
	const bools = BitHelper.byteToBooleans(this.array[this.index]);
	bools[this.boolIndex++] = boolean;
	this.internalAddByte(BitHelper.booleansToByte(bools));
	this.index--;//undo the increment of the internalAddByte
};

BitHelper.ByteArrayBitOutput.prototype.internalAddByte = function(byte){
	this.array[this.index++] = byte;
};

BitHelper.ByteArrayBitOutput.prototype.increaseCapacity = function(){
	const newArray = new Int8Array(this.index + 500);//add some extra space to improve performance
	javaArrayCopy(this.array, 0, newArray, 0, this.array.length);
	this.array = newArray;
};

BitHelper.ByteArrayBitOutput.prototype.writeByte = function(byte){
	if (this.index >= this.array.length){
		this.increaseCapacity();
	}
	if(this.boolIndex === 0){
		this.internalAddByte(byte);
		return;
	}
	const bools = BitHelper.byteToBooleans(byte);
	const current = BitHelper.byteToBooleans(this.array[this.index]);
	let boolsIndex = 0;
	for(let index = this.boolIndex; index < 8; index++){
		current[index] = bools[boolsIndex++];
	}
	this.internalAddByte(BitHelper.booleansToByte(current));
	const next = [false, false, false, false, false, false, false, true];
	let nextIndex = 0;
	for(; boolsIndex < 8; boolsIndex++){
		next[nextIndex++] = bools[boolsIndex];
	}
	if (this.index >= this.array.length){
		this.increaseCapacity();
	}
	this.internalAddByte(BitHelper.booleansToByte(next));
	this.index--;//the index has been increased twice
};