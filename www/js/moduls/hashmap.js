function Map() {
    this.keys = new Array();
    this.data = new Object();

    this.put = function (key, value) {
        this.remove(key);
        if (this.data[key] == null) {
            this.keys.push(key);
        }
        this.data[key] = value;
    };

    this.get = function (key) {
        return this.data[key];
    };

    this.remove = function (key) {
//        console.log("DELETE: " + key);
        removeAllByName(this.keys,key);
        delete this.data[key];
        
        function removeAllByName(arr, name) {
            while (arr.indexOf(name) !== -1) {
                var index = arr.indexOf(name);
                arr.splice(index, 1);
            }
        }
    };
    

    this.each = function (fn) {
        if (typeof fn != 'function') {
            return;
        }
        var len = this.keys.length;
        for (var i = 0; i < len; i++) {
            var k = this.keys[i];
            if(this.data[k] === undefined){
                console.log("data = null" + " / i: " + i + " / " + this.keys[i]);
                console.log(this.keys);
              continue;
            }
            fn(k, this.data[k], i);
        }
    };

    this.entrys = function () {
        var len = this.keys.length;
        var entrys = new Array(len);
        for (var i = 0; i < len; i++) {
            entrys[i] = {
                key: this.keys[i],
                value: this.data[i]
            };
        }
        return entrys;
    };

    this.isEmpty = function () {
        return this.keys.length == 0;
    };

    this.size = function () {
        return this.keys.length;
    };
}

module.exports = new Map();