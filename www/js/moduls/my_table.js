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
                    var td = $("<td class='my-table-basic-td'>" + value[colName] + '</td>');
                    td.data('_id', value._id);
                    td.data('col', colName);
                    td.data('value', value[colName]);
                    $(tr).append(td);
                });
                //
                var td_del = $("<td><img src='images/delete.png' class='basic-icon my-table-delete'></td>");
                $(td_del).find('.my-table-delete').data('_id', value._id);
                //
                $(tr).append(td_del);
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

            $('body').on('click', '.my-table-basic-td', function () {
                that.edit($(this).data('_id'), $(this).data('col'), $(this).data('value'));
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

    this.edit = function (_id, col, value) {
        var that = this;
        console.log("td clicked:" + _id + " / " + col + " / " + value);

        var updateSetting = {};
        var input = $("<input type='text' class='text-input' value='" + value + "'>");

        showInputModalB("Edit", "", input, 'sm', function (modalInput) {
            //
            var input = $(modalInput).find('.text-input').val();
            updateSetting[col] = input;
            //
            if (input) {
                that.REST.update(_id, updateSetting, function (data, textStatus, jqXHR) {
                    that.show();
                });
            }
            //
        });
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
