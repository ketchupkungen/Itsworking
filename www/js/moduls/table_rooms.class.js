//'use strict';
class RoomTable extends Table {
    
    constructor(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,
    populate,fieldsHeadersSettingsPop,modalPreviewColPop) {
    
    super(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,populate,fieldsHeadersSettingsPop,modalPreviewColPop);
  
    }
  
  
  show(){
//    super.show();
     console.log("extended");
  }
  
  this.colNewElemMap = {};
  
  
  setAddNewElementColumn(colName,elemToShow){
      this.colNewElemMap[colName] = elemToShow;
  }
  
  
}