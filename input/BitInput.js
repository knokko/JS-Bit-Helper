BitHelper.BitInput = function(){};

BitHelper.BitInput.prototype.readShort = function(){
	return BitHelper.makeShort(this.readByte(), this.readByte());
};

BitHelper.BitInput.prototype.readChar = function(){
	return BitHelper.makeChar(this.readByte(), this.readByte());
};

BitHelper.BitInput.prototype.readInt = function(){
	return BitHelper.makeInt(this.readByte(), this.readByte(), this.readByte(), this.readByte());
};

BitHelper.BitInput.prototype.readBooleans = function(amount){
	const array = new Array(amount);
	for(let index = 0; index < amount; index++){
		array[index] = this.readBoolean();
	}
	return array;
};

BitHelper.BitInput.prototype.readBytes = function(amount){
	const array = new Int8Array(amount);
	for(let index = 0; index < amount; index++){
		array[index] = this.readByte();
	}
	return array;
};

BitHelper.BitInput.prototype.readShorts = function(amount){
	const array = new Int16Array(amount);
	for(let index = 0; index < amount; index++){
		array[index] = this.readShort();
	}
	return array;
};

BitHelper.BitInput.prototype.readChars = function(amount){
	const array = new Uint16Array(amount);
	for(let index = 0; index < amount; index++){
		array[index] = this.readChar();
	}
	return array;
};

BitHelper.BitInput.prototype.readInts = function(amount){
	const array = new Int32Array(amount);
	for(let index = 0; index < amount; index++){
		array[index] = this.readInt();
	}
	return array;
};

BitHelper.BitInput.prototype.readBooleanArray = function(){
	return this.readBooleans(this.readInt());
};

BitHelper.BitInput.prototype.readByteArray = function(){
	return this.readBytes(this.readInt());
};

BitHelper.BitInput.prototype.readShortArray = function(){
	return this.readShorts(this.readInt());
};

BitHelper.BitInput.prototype.readCharArray = function(){
	return this.readChars(this.readInt());
};

BitHelper.BitInput.prototype.readIntArray = function(){
	return this.readInts(this.readInt());
};

BitHelper.BitInput.prototype.readNumber = function(bitCount, allowNegative){
	let size = bitCount;
	if(allowNegative){
		size++;
	}
	return BitHelper.numberFromBooleans(this.readBooleans(size), bitCount, allowNegative);
};

BitHelper.BitInput.prototype.readJavaString = function(){
	const length = this.readInt();
	if(length === -1){
		return null;
	}
	const bitCount = this.readNumber(4, false) + 1;
	let string = '';
	for(let index = 0; index < length; index++){
		string += String.fromCharCode(this.readNumber(bitCount, false));
	}
	return string;
};

BitHelper.BitInput.prototype.readString = function(){
	const length1 = this.readByte() & 0xFF;

	if (length1 === 0){

		// This is how we save null/undefined strings
		return null;
	}

	let length = 0;
	if (length1 < 255){
		length = length1 - 1;
	} else {
		length = this.readInt();
	}

	// If length is 0, it must be the empty string
	if (length === 0){
		return '';
	}

	const chars = new Uint16Array(length);

	const min = this.readChar();
	const bitCount = this.readNumber(5, false);

	if (bitCount === 0){

		// The string is a sequence that repears the same character, like 'aaa'
		for (let index = 0; index < length; index++){
			chars[index] = min;
		}
	} else {

		// We will have to do some effort to read the string
		for (let index = 0; index < length; index++){
			chars[index] = min + this.readNumber(bitCount, false);
		}
	}

	return BitHelper.stringFromUint16Array(chars);
};