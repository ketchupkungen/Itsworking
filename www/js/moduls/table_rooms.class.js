//'use strict';
class RoomTable extends Table {
    
    constructor(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,
    populate,fieldsHeadersSettingsPop,modalPreviewColPop) {
    
    super(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,populate,fieldsHeadersSettingsPop,modalPreviewColPop);
  
//      this.show = show;
  
    }
  
  
  show(){
     console.log("extended");
  }
  
  
}