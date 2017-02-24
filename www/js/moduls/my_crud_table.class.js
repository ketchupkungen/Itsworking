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

    this.SHOW_INVERT = false;
    this.SHOW_NORMAL = false;

    this.headersFieldsMap = {};

    Table.prototype.show = function (initial) {
        var that = this;

        if (initial) {
            this.SHOW_INVERT = false;
            this.SHOW_NORMAL = false;
        }

        check();

        $(window).resize(function () {
            check();
        });

        function check() {
            if ($(document).width() < 1000 && that.SHOW_INVERT === false) {
                that.showInvert();
                that.SHOW_INVERT = true;
                that.SHOW_NORMAL = false;
            }

            if ($(document).width() > 1000 && that.SHOW_NORMAL === false) {
                that.showNormal();
                that.SHOW_INVERT = false;
                that.SHOW_NORMAL = true;
            }
        }
    };


    this.showNormal = function () {
        $(document).off('DOMNodeInserted');
        $(this.containerId).empty();
        this.loadTemplateBasic();
        //
        var submit = $(this.template).find('input');
        $(submit).attr('id', this.CREATE);
        //
        this.setTableTitle();
        this.mapHeadersAndFields();
        this.buildTableHeaders();
        this.buildTable();

        $(this.containerId).append(this.template);
    };

    this.maxPopDepth = 0;

    this.buildTable = function () {
        var tbody = $(this.template).find('tbody');
        $(this.template).find('table').addClass('.' + this.uniquePrefix + '-table');
        var that = this;
        this.maxPopDepth = 0;

        this.REST.find(_find(this.searchOptions), function (data, textStatus, jqXHR) {
            $(data).each(function (i, value) {
                //
                var tr = $("<tr class='tbody-tr'>");
                //
                that.buildRegular(value, tr);
                //
                //
                that.buildPopulattion(value, tr);
                //
                that.markLastRow(tr, data, i, 'last-tr-' + that.uniquePrefix);
                //
                $(tbody).append(tr);
                //
            });
            //
            that.addTableControls(data);
        });
    };

    this.monitorLastRowVisible = function (uniquePrefix) {
        var last_tr = '.last-tr-' + uniquePrefix;
        var last_tr_invert = '.last-tr-invert-' + uniquePrefix;

        var id = setInterval(function () {

            if (exists(last_tr) && $(last_tr).is(':visible')) {
                console.log("CHECKING", last_tr);

                if (scrolledToView(last_tr) && $(last_tr).is(':visible')) {
                    console.log('visible', last_tr);
                    $(last_tr).removeClass('last-tr-' + uniquePrefix);
                }
            }

            if (exists(last_tr_invert) && $(last_tr_invert).is(':visible')) {
                console.log("CHECKING", last_tr_invert);
                if (scrolledToView(last_tr_invert) && $(last_tr_invert).is(':visible')) {
                    console.log('visible', last_tr_invert);
                    $(last_tr_invert).removeClass('last-tr-invert-' + uniquePrefix);
                }
            }


        }, 2000);
    };


    this.markLastRow = function (elem, arr, i, _class) {
        if (arr.length === (i + 1)) {
            console.log("LAST__", _class);
            $(elem).addClass(_class);
        }
    };

    this.buildRegular = function (value, tr) {
        //
        $(this.fieldsArr).each(function (i, colName) {
            var td = $('<td>');
            //
            if (colName === this.modalPreviewCol) {
                this.setModalPreview(td, value, colName);
            } else {
                td.append("" + value[colName]);
            }
            //
            $(td).addClass(this.EDIT);
            td.data('_id', value._id);
            td.data('col', colName);
            td.data('value', value[colName]);
            $(tr).append(td);
        });
    };

    this.buildPopulattion = function (value, tr) {
        if (this.populate) {

            var colNames = Object.keys(this.fieldsHeadersSettingsPop);
            var colNameModalPreviewPop = Object.keys(this.fieldsHeadersSettingsPop)[0];

            var pop = value[this.populate];

            var popDepth = 0;

            $(pop).each(function (i, popObj) {
                //
                $(colNames).each(function (i, val) {
                    var td = $("<td class='td-populated'>");
                    //
                    if (colNames[i] === colNameModalPreviewPop) {
                        this.setModalPreviewPop(td, popObj, colNames[i]);
                    } else {
                        $(td).append(popObj[colNames[i]]);
                    }
                    //
                    $(td).data("_id", popObj._id);
                    $(tr).append(td);
                });
                //
                popDepth++;
                if (popDepth > this.maxPopDepth) {
                    this.maxPopDepth = popDepth;
                    this.addTableHeadersIfPopulated(colNames[i]);
                }
                //
            });
        }
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

    //This is launched only once uppon instantiation of class
    this.setListeners = function () {
        var that = this;
        $(document).ready(function () {
            //=============
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

            $('body').on('click', ".th-" + that.uniquePrefix, function () {
                that.sort(this);
            });

            //=============
            $('body').on('mouseover', "." + that.EDIT, function () {
                $("." + that.EDIT).css('cursor', "url('images/edit.png'), auto");
            });

            $('body').on('mouseover', ".th-" + that.uniquePrefix, function () {
                var colName = $(this).attr('col');
                var path;
                that.sort_map[colName] === 'asc' ? path = 'images/sort-asc.png' : path = 'images/sort-desc.png';
                $(this).css('cursor', "url(" + path + "), auto");
            });
            //=============

        });
    };

    this.sort_asc = true;
    this.sort_map = {};

    this.sort = function (thiss) {
        var colName = $(thiss).attr('col');

        if (this.sort_map[colName] === 'asc') {
            this.sort_map[colName] = 'desc';
        } else {
            this.sort_map[colName] = 'asc';
            colName = "-" + colName;
        }

        this.searchOptions['_sort'] = colName;
        this.show(true);
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
                    console.log("create entity:", data);
                    that.show(true);
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
                that.SHOW_INVERT = false;
                that.SHOW_NORMAL = false;
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
                    that.show(true);
                });
            }
            //
        });
    };

    this.setTableTitle = function () {
        var h3 = $(this.template).find('#table-title');
        $(h3).text(this.tableTitle);
    };


    this.mapHeadersAndFields = function () {
        var that = this;

        $(this.headers).each(function (index, value) {
            that.headersFieldsMap[value] = that.fieldsArr[index];
        });
    };

    this.buildTableHeaders = function () {
        var that = this;
        var thead_tr = $(this.template).find('#thead-tr');

        $(this.headers).each(function (index, value) {
            var th = $("<th class=th-" + that.uniquePrefix + ">");
            var col = that.headersFieldsMap[value];
            $(th).attr('col', col);
            $(th).append(value);
            $(thead_tr).append(th);
        });
    };

    this.loadTemplateBasic = function () {
        this.template = $(loadTemplate("templates/admin/basic/tableBasic.html"));
    };

    this.setListeners();
    this.monitorLastRowVisible(this.uniquePrefix);

    //==========================================================================
    //==========================================================================

    this.showInvert = function () {

        var that = this;
        this.showNormal();
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
            th_arr_b.push(th);
        });
        return th_arr_b;
    };


    this.transformTable = function () {
        var that = this;
        var container = $("<div class='table-show-invert' " + this.uniquePrefix + '-invert-table>');

        var th_arr = this.buildHeadersArr();
        var tr_arr = $('.tbody-tr');

        $(tr_arr).each(function (i, tr) {
            var td_arr = $(tr).children('td');

            $(th_arr).each(function (x, th) {
                var row_invert = $("<div class='row-invert'></div>");
                var row_invert_empty = $("<div class='row-invert-empty'></div>");

                $(row_invert).append(th.cloneNode(true));
                var td = $(td_arr[x]);
                $(td).addClass('td-invert');
                $(row_invert).append(td);
                $(container).append(row_invert);
                containsElement(td, 'img') ? $(container).append(row_invert_empty) : undefined;
                //
                if (th_arr.length === (x + 1)) {
                    that.markLastRow(row_invert, tr_arr, i, 'last-tr-invert-' + that.uniquePrefix);
                }
                //
            });

        });

        $("#content-main").append(container);
        this.removeEmptyRowsPopulation();


        var addNewBtn = $(".add-new-btn");
        $("#content-main").prepend(addNewBtn);


        var title = $("#table-title");
        $("#content-main").prepend(title);
    };

    this.removeEmptyRowsPopulation = function () {
        var td_empty_arr = $('.empty');

        $(td_empty_arr).each(function (i, td_empty) {
            $(td_empty).parent().remove();
        });

    };

    //==========================================================================
    function scrolledToView(selector) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(selector).offset().top;
        var elemBottom = elemTop + $(selector).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    function exists(selector) {
        if ($(selector).length) {
            return true;
        } else {
            return false;
        }
    }


}
