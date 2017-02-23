//'use strict';
class RoomTable extends Table {
    
    constructor(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,
    populate,fieldsHeadersSettingsPop,modalPreviewColPop) {
    
    super(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,populate,fieldsHeadersSettingsPop,modalPreviewColPop);
  
    }
  
  
  show(){
     console.log("extended");
//     super();
  }
  
  test(){
      console.log("test: ", this.headers);
  }
  
}