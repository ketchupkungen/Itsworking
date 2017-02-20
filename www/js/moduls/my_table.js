function Table(uniquePrefix,rest, tableTitle, containerId, headersArr, fieldsArr, populate, fieldsHeadersSettingsPop) {

    this.REST = rest;
    this.tableTitle = tableTitle;
    this.containerId = containerId; // the container where the table is inserted
    this.headers = headersArr;
    this.fieldsArr = fieldsArr;
    this.fieldsHeadersSettingsPop = fieldsHeadersSettingsPop; // {name:'Education'} -> where name = real colName & Edu.. = name of Header
    this.populate = populate; // EX: _educations
    this.template;
    this.uniquePrefix = uniquePrefix;

    this.show = function () {
        $(this.containerId).empty();
        this.loadTemplateBasic();
        this.setTableTitle();
        this.buildTableHeaders();
        this.buildTable();
        $(this.containerId).append(this.template);
    };

    this.maxPopDepth = 0;

    this.buildTable = function () {
        var tbody = $(this.template).find('tbody');
        var that = this;
        this.maxPopDepth = 0;

        this.REST.find(_find({_fields: '', _sort: 'basicroute', _skip: 0, _limit: 10000}), function (data, textStatus, jqXHR) {
            $(data).each(function (i, value) {
                var tr = $("<tr class='tbody-tr'>");
                //
                $(that.fieldsArr).each(function (i, colName) {
                    var td = $("<td class='my-table-basic-edit'>" + "<a class='admin-modal-preview'>" + value[colName] + "</a>" + '</td>');
                    $(td).find('.admin-modal-preview').data('_id', value._id);
                    $(td).find('.admin-modal-preview').data('rest', that.REST);
                    td.data('_id', value._id);
                    td.data('col', colName);
                    td.data('value', value[colName]);
                    $(tr).append(td);
                });
                //
                //
                if (that.populate) {

                    var colNames = Object.keys(that.fieldsHeadersSettingsPop);

                    var pop = value[that.populate];

                    var popDepth = 0;

                    $(pop).each(function (i, popObj) {
                        //
                        $(colNames).each(function (i, val) {
                            var td = $("<td class='my-table-basic-edit-populated'>" + popObj[colNames[i]] + '</td>');
                            $(td).data("_id", popObj._id);
                            $(tr).append(td);
                        });
                        //
                        popDepth++;
                        if (popDepth > that.maxPopDepth) {
                            that.maxPopDepth = popDepth;
//                            console.log("depth", that.maxPopDepth);
                            that.addTableHeadersIfPopulated(colNames[i]);
                        }
                        //
                    });
                }
                //
                //
                $(tbody).append(tr);
                //
            });
            //
            that.addTableControls(data);
        });
    };

    this.addTableControls = function (data) {
        this.fillAllEmptyTrElems();

        var trArr = $('.tbody-tr');

        for (var i = 0; i < data.length; i++) {
            var td_del = $("<td><img src='images/delete.png' class='basic-icon my-table-delete'></td>");
            $(td_del).find('.my-table-delete').data('_id', data[i]._id);
            $(trArr[i]).append(td_del);
        }

        //OBS! OBS! OBS! EACH NOT WORKING HERE!
//        $(data).each(function (i, value) {
//            var td_del = $("<td><img src='images/delete.png' class='basic-icon my-table-delete'></td>");
//            $(td_del).find('.my-table-delete').data('_id', value._id);
//            $(trArr[i]).append(td_del);
//        });
    };


    this.findMaxTdInTr = function () {
        var trArr = $('.tbody-tr');
        var max = 0;
        for (var i = 0; i < trArr.length; i++) {
            var ammount = $(trArr[i]).children('td').length;
            ammount > max ? max = ammount : max;
        }
        return max;
    };


    this.fillAllEmptyTrElems = function () {
        var trArr = $('.tbody-tr');
        var maxTDinTR = this.findMaxTdInTr();

        for (var i = 0; i < trArr.length; i++) {
            while ($(trArr[i]).children('td').length < maxTDinTR) {
                $(trArr[i]).append("<td class='empty'>");
            }
        }
    };

    this.addTableHeadersIfPopulatedNew = function (colName) {
        var thead_tr = $(this.template).find('#thead-tr');
        var colHeader = this.fieldsHeadersSettingsPop[colName];
        //
        var th = $("<th class='th-population'>");
        $(th).append(colHeader);
        $(thead_tr).append(th);
    };

    this.addTableHeadersIfPopulated = function () {
        var thead_tr = $(this.template).find('#thead-tr');
//        var len = Object.keys(this.fieldsHeadersSettingsPop).length;
        $.each(this.fieldsHeadersSettingsPop, function (colName, colHeader) {
            var th = $("<th class='th-population'>");
            $(th).append(colHeader);
            $(thead_tr).append(th);
        });
    };

    
    
    this.setListeners = function () {
        var that = this;
        $(document).ready(function () {
            $('body').on('click', '.my-table-delete', function () {
                that.delete($(this).data('_id'));
            });

            $('body').on('click', '.my-table-basic-edit', function () {
                that.edit($(this).data('_id'), $(this).data('col'), $(this).data('value'));
            });

            $('body').on('click', '#table-basic-add-new-btn', function () {
                that.create();
            });
        });
    };

    this.create = function () {
        var that = this;
        var updateSettings = {};
        this.buildCreateInput(function (input) {
            showInputModalB("Create new", "", input, 'sm', function (modalInput) {
                if (!modalInput) {
                    
                    return;
                }
                $(that.fieldsArr).each(function (i, colName) {
                    updateSettings[colName] = modalInput.find("#" + colName).val();
                    
                    console.log("settings: ", updateSettings);
                });
                //
                that.REST.create(updateSettings, function (data, textStatus, jqXHR) {
                    console.log("create teacher:", data);
                    that.show();
                });
            });
        });
    };

    this.buildCreateInput = function (cb) {
        var that = this;
        var form = $("<form class='table-basic-auto-create-form'>");
        $(this.fieldsArr).each(function (i, colName) {
            $(form).append("<p>" + that.headers[i] + "</p>");
            $(form).append("<input type='text' id='" + colName + "'>");
        });
        cb(form);
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

    this.setListeners();

}
