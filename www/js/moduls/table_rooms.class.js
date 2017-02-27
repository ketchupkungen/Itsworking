//'use strict';
class RoomTable extends Table {
    
    constructor(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,
    populate,fieldsHeadersSettingsPop,modalPreviewColPop) {
    
        super(uniquePrefix,rest,tableTitle,containerId,headersArr,fieldsArr,searchOptions,modalPreviewCol,populate,fieldsHeadersSettingsPop,modalPreviewColPop);
        
        this.colNewElemMap = {};
    }
  
//Example verified 
//  show(){
////    super.show();
//     console.log("extended");
//  }
  
  
  setAddNewElementColumn(colName,elemToShow){
      this.colNewElemMap[colName] = elemToShow;
      console.log('setAddNewElementColumn',this.colNewElemMap);
  }
  
  //override
  buildCreateInput(cb){
      console.log("OVERRIDE");
       var that = this;
        var form = $("<form class='table-basic-auto-create-form'>");
        $(this.fieldsArr).each(function (i, colName) {
            //
            $(form).append("<p>" + that.headers[i] + "</p>");
            //
            if(that.colNewElemMap[colName]){
                var specialInput = $("<div id='" + colName + "'></div>");
                $(that.colNewElemMap[colName]).addClass('special-input');
                $(specialInput).append(that.colNewElemMap[colName]);
                $(form).append(specialInput);
            }else{
                $(form).append("<input type='text' id='" + colName + "'>");
            }
            //
        });
        cb(form);
  }
  
  
  
  
  
}