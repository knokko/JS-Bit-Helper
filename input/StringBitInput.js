BitHelper.StringBitInput = function(string, startIndex, terminate){
	this.string = string;
	this.index = startIndex || 0;
	this.boolIndex = 0;
	if(terminate){
		this.terminate = terminate;
	}
};

extendProtoType(BitHelper.BitInput, BitHelper.StringBitInput);

BitHelper.StringBitInput.prototype.terminate = function(){};

BitHelper.StringBitInput.prototype.readBoolean = function(){
	if(this.boolIndex < 8){
		return BitHelper.byteToBooleans(BitHelper.char0(this.string.charCodeAt(this.index)))[this.boolIndex++];
	}
	if(this.boolIndex === 15){
		this.boolIndex = 0;
		return BitHelper.byteToBooleans(BitHelper.char1(this.string.charCodeAt(this.index++)))[7];
	}
	return BitHelper.byteToBooleans(BitHelper.char1(this.string.charCodeAt(this.index)))[this.boolIndex++ - 8];
};

BitHelper.StringBitInput.prototype.readByte = function(){
	if(this.boolIndex === 0){
		this.boolIndex = 8;
		return BitHelper.char0(this.string.charCodeAt(this.index));
	}
	if(this.boolIndex === 8){
		this.boolIndex = 0;
		return BitHelper.char1(this.string.charCodeAt(this.index++));
	}
	let bools1;
	let bools2;
	if(this.boolIndex < 8){
		const charCode = this.string.charCodeAt(this.index);
		bools1 = BitHelper.byteToBooleans(BitHelper.char0(charCode));
		bools2 = BitHelper.byteToBooleans(BitHelper.char1(charCode));
		this.boolIndex += 8;
	}
	else {
		bools1 = BitHelper.byteToBooleans(BitHelper.char1(this.string.charCodeAt(this.index++)));
		bools2 = BitHelper.byteToBooleans(BitHelper.char0(this.string.charCodeAt(this.index)));
		this.boolIndex -= 8;
	}
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