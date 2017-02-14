class REST {

  constructor(entityName){
    this.baseUrl = '/rest/' + entityName + '/';
  }

  create(properties,callback){
    console.log("CREATE URL: " + this.baseUrl);  
    console.log("DATA: " + JSON.stringify(properties));
    
    $.ajax({
      url: this.baseUrl,
      type: "POST",
      dataType: "json",
      // don't process the request body
      processData: false,
      // and tell Node that it is raw json
      headers: {"Content-Type": "application/json"},
      // the request body
      data: JSON.stringify(properties),
      // callback functions
      success: callback,
      error: callback
    });

  }
  
  createRef(properties,callback){
    console.log("CREATE URL: " + this.baseUrl + 'addReference/');  
    console.log("DATA: " + JSON.stringify(properties));
    
    $.ajax({
      url: this.baseUrl + 'addReference/',
      type: "POST",
      dataType: "json",
      // don't process the request body
      processData: false,
      // and tell Node that it is raw json
      headers: {"Content-Type": "application/json"},
      // the request body
      data: JSON.stringify(properties),
      // callback functions
      success: callback,
      error: callback
    });

  }

  find(idOrQuery,callback){
   console.log("FIND URL: " + this.baseUrl + idOrQuery);

    idOrQuery = idOrQuery || '';

    $.ajax({
      url: this.baseUrl + idOrQuery,
      type: "GET",
      dataType: "json",
      success: callback,
      error: callback
    });

  }

  update(idOrQuery,properties,callback){
    console.log("UPDATE URL: " + this.baseUrl + idOrQuery);
    console.log("DATA: " + JSON.stringify(properties));
    
    $.ajax({
      url: this.baseUrl + idOrQuery,
      type: "PUT",
      dataType: "json",
      // don't process the request body
      processData: false,
      // and tell Node that it is raw json
      headers: {"Content-Type": "application/json"},
      // the request body
      data: JSON.stringify(properties),
      // callback functions
      success: callback,
      error: callback
      
    });
  }

  delete(idOrQuery,callback){
    console.log("DELETE URL: " + this.baseUrl + idOrQuery);
    $.ajax({
      url: this.baseUrl + idOrQuery,
      type: "DELETE",
      dataType: "json",
      // callback functions
      success: callback,
      error: callback
      
    });
  }
  
  deleteRef(idOrQuery,properties,callback){
    console.log("UPDATE URL: " + this.baseUrl + idOrQuery);
    console.log("DATA: " + JSON.stringify(properties));
    
    $.ajax({
      url: this.baseUrl + 'deleteReference/' + idOrQuery,
      type: "DELETE",
      dataType: "json",
      // don't process the request body
      processData: false,
      // and tell Node that it is raw json
      headers: {"Content-Type": "application/json"},
      // the request body
      data: JSON.stringify(properties),
      // callback functions
      success: callback,
      error: callback
      
    });
  }
  

}
