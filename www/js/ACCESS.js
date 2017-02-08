function DISPLAY_ACCESS_CONTROL(){
    if(ACCESS_LEVEL < 3){
        $('#access-admin-panel').css('display','none');
    }
}