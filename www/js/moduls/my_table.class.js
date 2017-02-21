function Table(
        uniquePrefix,
        rest,
        tableTitle,
        containerId,
        headersArr,
        fieldsArr,
        searchOptions,
        modalPreviewCol,
        populate,
        fieldsHeadersSettingsPop,
        modalPreviewColPop
        ) {

    this.REST = rest;
    this.uniquePrefix = uniquePrefix;
    this.tableTitle = tableTitle;
    this.containerId = containerId; // the container where the table is inserted
    this.headers = headersArr;
    this.fieldsArr = fieldsArr;
    this.fieldsHeadersSettingsPop = fieldsHeadersSettingsPop; // {name:'Education'} -> where name = real colName & Edu.. = name of Header
    this.populate = populate; // EX: _educations
    this.template;
    this.searchOptions = searchOptions;
    this.modalPreviewCol = modalPreviewCol;
    this.modalPreviewColPop = modalPreviewColPop;


    this.show = function () {
        $(document).off('DOMNodeInserted');
        $(this.containerId).empty();
        this.loadTemplateBasic();
        //
        var submit = $(this.template).find('input');
        $(submit).attr('id', this.CREATE);
        //
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

        this.REST.find(_find(this.searchOptions), function (data, textStatus, jqXHR) {
            $(data).each(function (i, value) {
                var tr = $("<tr class='tbody-tr'>");
                //
                $(that.fieldsArr).each(function (i, colName) {
                    var td = $('<td>');
                    //
                    if (colName === that.modalPreviewCol) {
                        that.setModalPreview(td, value, colName);
                    } else {
                        td.append(value[colName]);
                    }
                    //
                    $(td).addClass(that.EDIT);
                    td.data('_id', value._id);
                    td.data('col', colName);
                    td.data('value', value[colName]);
                    $(tr).append(td);
                });
                //
                //
                if (that.populate) {

                    var colNames = Object.keys(that.fieldsHeadersSettingsPop);
                    var colNameModalPreviewPop = Object.keys(that.fieldsHeadersSettingsPop)[0];

                    var pop = value[that.populate];

                    var popDepth = 0;

                    $(pop).each(function (i, popObj) {
                        //
                        $(colNames).each(function (i, val) {
                            var td = $("<td class='td-populated'>");
                            //
                            if (colNames[i] === colNameModalPreviewPop) {
                                that.setModalPreviewPop(td, popObj, colNames[i]);
                            } else {
                                $(td).append(popObj[colNames[i]]);
                            }
                            //
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

    this.setModalPreviewPop = function (td, popObj, colName) {
        var a = $("<a class='admin-modal-preview'>" + popObj[colName] + "</a>");
        $(td).append(a);
        $(td).find('.admin-modal-preview').data('_id', popObj._id);
        $(td).find('.admin-modal-preview').data('rest', this.modalPreviewColPop[colName]);
    };

    this.setModalPreview = function (td, value, colName) {
        var a = $("<a class='admin-modal-preview'>" + value[colName] + "</a>");
        $(td).append(a);
        $(td).find('.admin-modal-preview').data('_id', value._id);
        $(td).find('.admin-modal-preview').data('rest', this.REST);
    };


    this.addTableControls = function (data) {
        this.fillAllEmptyTrElems();
        //
        var trArr = $('.tbody-tr');
        //
        for (var i = 0; i < data.length; i++) {
            var td_del = $("<td><img src='images/delete.png' class='basic-icon'></td>");
            $(td_del).find('img').addClass(this.DELETE);
            $(td_del).find('img').data('_id', data[i]._id);
            $(trArr[i]).append(td_del);
        }
        //
        this.fillAllEmptyThElems();

        //OBS! OBS! OBS! EACH NOT WORKING HERE!
//        $(data).each(function (i, value) {
//            var td_del = $("<td><img src='images/delete.png' class='basic-icon my-table-delete'></td>");
//            $(td_del).find('.my-table-delete').data('_id', value._id);
//            $(trArr[i]).append(td_del);
//        });
    };


    this.fillAllEmptyThElems = function () {
        var thead_tr = $(this.template).find('#thead-tr');
        var amount_th = $(thead_tr).children().length;
        var maxTDinTR = this.findMaxTdInTr();
        while (amount_th < maxTDinTR) {
            $(thead_tr).append("<th class='empty-th'>");
            amount_th++;
        }
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

    this.findMaxTdInTr = function () {
        var trArr = $('.tbody-tr');
        var max = 0;
        for (var i = 0; i < trArr.length; i++) {
            var ammount = $(trArr[i]).children('td').length;
            ammount > max ? max = ammount : max;
        }
        return max;
    };

    this.addTableHeadersIfPopulated = function () {
        var thead_tr = $(this.template).find('#thead-tr');
        $.each(this.fieldsHeadersSettingsPop, function (colName, colHeader) {
            var th = $("<th class='th-population'>");
            $(th).append(colHeader);
            $(thead_tr).append(th);
        });
    };

    this.DELETE = "" + this.uniquePrefix + "-" + "my-table-delete";
    this.EDIT = "" + this.uniquePrefix + "-" + "my-table-basic-edit";
    this.CREATE = this.uniquePrefix + "-" + "table-basic-add-new-btn";

    this.setListeners = function () {
        var that = this;
        $(document).ready(function () {
            $('body').on('click', "." + that.DELETE, function () {
                that.delete($(this).data('_id'));
            });

            $('body').on('click', "." + that.EDIT, function () {
                that.edit($(this).data('_id'), $(this).data('col'), $(this).data('value'));
            });

            $('body').on('click', "#" + that.CREATE, function () {
                that.create();
            });

            //=============
            $('body').on('mouseover', "." + that.EDIT, function () {
                $("." + that.EDIT).css('cursor', "url('images/edit.png'), auto");
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
        showConfirmModal("OBS!", "Bekräfta handling", 'sm', 'error', function (yes) {
            if (!yes) {
                return;
            }

            that.REST.delete(_id, function (data, textStatus, jqXHR) {
                that.show();
            });

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

    //==========================================================================
    //==========================================================================

    this.showInvert = function () {
        var that = this;
        this.show();
        $('.admin-show-items').css('display', 'none');
        //
        this.ready(function () {
            that.transformTable();
        });
    };

    this.ready = function (cb) {
        $(document).on('DOMNodeInserted', '.empty-th', function () {
            console.log("Yay");
            cb();
        });

    };

    this.buildHeadersArr = function () {
        th_arr = $('th');
        var th_arr_b = [];
        $(th_arr).each(function (x, th) {
            th_arr_b.push($(th).text());
        });
        return th_arr_b;
    };


    this.transformTable = function () {
        var container = $("<div class='table-show-invert'>");

        var th_arr = this.buildHeadersArr();
        var tr_arr = $('.tbody-tr');

        this.buildHeadersArr(th_arr);

        $(tr_arr).each(function (i, tr) {
            var td_arr = $(tr).children('td');

            $(th_arr).each(function (x, th) {
                var row_invert = $("<div class='row-invert'></div>");
                var row_invert_empty = $("<div class='row-invert-empty'></div>");

                $(row_invert).append("<th>" + th + "</th>");
                var td = $(td_arr[x]);
                $(td).addClass('td-invert');
                $(row_invert).append(td);
                $(container).append(row_invert);
                containsElement(td, 'img') ? $(container).append(row_invert_empty) : undefined;
            });

        });

        $("#content-main").append(container);
        this.removeEmptyRowsPopulation();
        
        var title = $("#table-title");
        $("#content-main").prepend(title);
        

    };

    this.removeEmptyRowsPopulation = function () {
        var td_empty_arr = $('.empty');

        $(td_empty_arr).each(function (i, td_empty) {
            $(td_empty).parent().remove();
        });

    };


}
