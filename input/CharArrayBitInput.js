BitHelper.CharArrayBitInput = function(array, startIndex, terminate){
	this.array = array;
	this.index = startIndex || 0;
	this.boolIndex = 0;
	if(terminate){
		this.terminate = terminate;
	}
};

extendProtoType(BitHelper.BitInput, BitHelper.CharArrayBitInput);

BitHelper.CharArrayBitInput.prototype.terminate = function(){};

BitHelper.CharArrayBitInput.prototype.readBoolean = function(){
	if(this.boolIndex < 8){
		return BitHelper.byteToBooleans(BitHelper.char0(this.array[this.index]))[this.boolIndex++];
	}
	if(this.boolIndex === 15){
		this.boolIndex = 0;
		return BitHelper.byteToBooleans(BitHelper.char1(this.array[this.index++]))[7];
	}
	return BitHelper.byteToBooleans(BitHelper.char1(this.array[this.index]))[this.boolIndex++ - 8];
};

BitHelper.CharArrayBitInput.prototype.readByte = function(){
	if(this.boolIndex === 0){
		this.boolIndex = 8;
		return BitHelper.char0(this.array[this.index]);
	}
	if(this.boolIndex === 8){
		this.boolIndex = 0;
		return BitHelper.char1(this.array[this.index++]);
	}
	let bools1;
	let bools2;
	if(this.boolIndex < 8){
		const charCode = this.array[this.index];
		bools1 = BitHelper.byteToBooleans(BitHelper.char0(charCode));
		bools2 = BitHelper.byteToBooleans(BitHelper.char1(charCode));
		this.boolIndex += 8;
	}
	else {
		bools1 = BitHelper.byteToBooleans(BitHelper.char1(this.array[this.index++]));
		bools2 = BitHelper.byteToBooleans(BitHelper.char0(this.array[this.index]));
		this.boolIndex -= 8;
	}
	const bools = new Array(8);
	let boolsIndex = 0;
	for(let index = this.boolIndex % 8; index < 8; index++){
		bools[boolsIndex++] = bools1[index];
	}
	let index = 0;
	for(; boolsIndex < 8; boolsIndex++){
		bools[boolsIndex] = bools2[index++]
	}
	return BitHelper.booleansToByte(bools);
};