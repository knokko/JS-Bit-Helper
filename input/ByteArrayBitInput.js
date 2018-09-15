BitHelper.ByteArrayBitInput = function(array, startIndex, terminate){
	this.array = array;
	this.index = startIndex ? startIndex : 0;
	this.boolIndex = 0;
	if(terminate){
		this.terminate = terminate;
	}
};

extendProtoType(BitHelper.BitInput, BitHelper.ByteArrayBitInput);

BitHelper.ByteArrayBitInput.prototype.terminate = function(){}

BitHelper.ByteArrayBitInput.prototype.readBoolean = function(){
	if(this.boolIndex === 7){
		this.boolIndex = 0;
		return BitHelper.byteToBooleans(this.array[this.index++])[7];
	}
	return BitHelper.byteToBooleans(this.array[this.index])[this.boolIndex++];
};

BitHelper.ByteArrayBitInput.prototype.readByte = function(){
	if(this.boolIndex === 0){
		return this.array[this.index++];
	}
	const bools1 = BitHelper.byteToBooleans(this.array[this.index++]);
	const bools2 = BitHelper.byteToBooleans(this.array[this.index]);//do not increaese the byteIndex because this byte is not yet finished
	const bools = new Array(8);
	let boolsIndex = 0;
	for(let index = this.boolIndex; index < 8; index++){
		bools[boolsIndex++] = bools1[index];
	}
	let index = 0;
	for(; boolsIndex < 8; boolsIndex++){
		bools[boolsIndex] = bools2[index++]
	}
	return BitHelper.booleansToByte(bools);
};