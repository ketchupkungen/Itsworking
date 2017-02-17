function Table(rest, tableTitle, containerId, headersArr, fieldsArr) {

    this.REST = rest;
    this.tableTitle = tableTitle;
    this.containerId = containerId;
    this.headers = headersArr;
    this.fieldsArr = fieldsArr;
    this.template;


    this.show = function () {
        $(this.containerId).empty();
        var tbody = $(this.template).find('tbody');
        $(tbody).empty();
        this.buildTable();
        $(this.containerId).append(this.template);
    };


    this.buildTable = function () {
        var tbody = $(this.template).find('tbody');
        var that = this;

        this.REST.find(_find({_fields: '', _sort: 'name', _skip: 0, _limit: 10000}), function (data, textStatus, jqXHR) {
            $(data).each(function (i, value) {
                var tr = $('<tr>');
                //
                $(that.fieldsArr).each(function (i, colName) {
                    $(tr).append('<td>' + value[colName] + '</td>');
                });
                //
                var td_del = $("<td><img src='images/delete.png' class='basic-icon my-table-delete'></td>");
                $(td_del).find('.my-table-delete').data('_id', value._id);
                var td_edit = $("<td><img src='images/edit.png' class='basic-icon my-table-edit'></td>");
                $(td_edit).find('.my-table-delete').data('_id', value._id);
                //
                $(tr).append(td_del);
                $(tr).append(td_edit);
                //
                $(tbody).append(tr);
            });

        });

    };

    this.setListeners = function () {
        var that = this;
        $(document).ready(function () {
            
            $('body').on('click', '.my-table-delete', function () {
                that.delete($(this).data('_id'));
            });
            
        });

    };

    this.delete = function (_id) {
        var that = this;
        this.REST.delete(_id, function (data, textStatus, jqXHR) {
            console.log('deleted', data);
            that.show();
        });
    };

    this.edit = function (_id) {

    };

    this.setTableTitle = function () {
        var h3 = $(this.template).find('#table-title');
        $(h3).text(this.tableTitle);
    };

    this.buildTableHeaders = function () {
        var thead_tr = $(this.template).find('#thead-tr');

        $(this.headers).each(function (index, value) {
            var th = $('<th>');
            $(th).append(value);
            $(thead_tr).append(th);
        });
    };

    this.loadTemplateBasic = function () {
        this.template = $(loadTemplate("templates/admin/basic/tableBasic.html"));
    };

    this.loadTemplateBasic();
    this.setTableTitle();
    this.buildTableHeaders();
    this.setListeners();

}
